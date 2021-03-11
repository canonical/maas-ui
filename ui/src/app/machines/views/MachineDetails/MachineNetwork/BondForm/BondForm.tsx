import { useCallback, useEffect, useState } from "react";

import { Button, Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import InterfaceFormTable from "../InterfaceFormTable";
import {
  networkFieldsSchema,
  networkFieldsInitialValues,
} from "../NetworkFields/NetworkFields";
import type { Selected, SetSelected } from "../NetworkTable/types";

import BondFormFields from "./BondFormFields";
import type { BondFormValues } from "./types";
import { LinkMonitoring } from "./types";
import { getFirstSelected } from "./utils";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  MachineDetails,
  NetworkInterface,
} from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  getInterfaceSubnet,
  getLinkFromNic,
  getNextNicName,
  isBondOrBridgeParent,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { toFormikNumber } from "app/utils";

type Props = {
  close: () => void;
  selected: Selected[];
  setSelected: SetSelected;
  systemId: MachineDetails["system_id"];
};

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  bond_downdelay: Yup.number(),
  bond_lacp_rate: Yup.mixed().oneOf(Object.values(BondLacpRate)),
  bond_miimon: Yup.number(),
  bond_mode: Yup.mixed()
    .oneOf(Object.values(BondMode))
    .required("Bond mode is required"),
  bond_updelay: Yup.number(),
  bond_xmit_hash_policy: Yup.mixed().oneOf(Object.values(BondXmitHashPolicy)),
  mac_address: Yup.string().matches(MAC_ADDRESS_REGEX, "Invalid MAC address"),
  name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

const generateToggleButton = (
  editingMembers: boolean,
  validNics: NetworkInterface[],
  selected: Selected[],
  setEditingMembers: (editingMembers: boolean) => void
) => {
  let editTooltip: string | null = null;
  let editDisabled = false;
  if (!editingMembers && validNics.length === 2) {
    // Disable the button to add more members if there are no more to choose
    // from.
    editTooltip = "There are no additional valid members";
    editDisabled = true;
  } else if (editingMembers && selected.length < 2) {
    // Don't let the user update the selection if they haven't chosen at least
    // two interfaces.
    editTooltip = "At least two interfaces must be selected";
    editDisabled = true;
  }
  return (
    <Tooltip message={editTooltip}>
      <Button
        data-test="edit-members"
        disabled={editDisabled}
        onClick={() => setEditingMembers(!editingMembers)}
        type="button"
      >
        {editingMembers ? "Update bond members" : "Edit bond members"}
      </Button>
    </Tooltip>
  );
};

const generateParents = (
  selected: Selected[],
  primary: NetworkInterface["id"]
) => {
  const parents = [primary];
  // Append all the interface ids from the selected nics.
  selected.forEach(({ nicId }) => {
    // Don't append the primary as it's already in the list.
    if (nicId && nicId !== primary) {
      parents.push(nicId);
    }
  });
  return parents;
};

const BondForm = ({
  close,
  selected,
  setSelected,
  systemId,
}: Props): JSX.Element | null => {
  const [editingMembers, setEditingMembers] = useState(false);
  const [bondVLAN, setBondVLAN] = useState<NetworkInterface["vlan_id"] | null>(
    null
  );
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  // Use the first selected interface as the canary for the fabric and VLAN.
  const firstSelected = machine ? getFirstSelected(machine, selected) : null;
  const firstNic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(
      state,
      systemId,
      firstSelected?.nicId,
      firstSelected?.linkId
    )
  );
  const firstLink = getLinkFromNic(firstNic, firstSelected?.linkId);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, bondVLAN || firstNic?.vlan_id)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const nextName = getNextNicName(machine, NetworkInterfaceTypes.BOND);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const hasEnoughNics = selected.length > 1;
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingBond",
    "createBond",
    () => close()
  );

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    // When the form is first show then store the VLAN for this bond. This needs
    // to be done so that if all interfaces become deselected then the VLAN
    // information is not lost.
    if (!bondVLAN && hasEnoughNics && firstNic) {
      setBondVLAN(firstNic?.vlan_id);
    }
  }, [bondVLAN, firstNic, hasEnoughNics, setBondVLAN]);

  if (
    !machine ||
    !("interfaces" in machine) ||
    !vlansLoaded ||
    !fabricsLoaded ||
    !subnetsLoaded
  ) {
    return <Spinner />;
  }
  const subnet = getInterfaceSubnet(
    machine,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    firstNic,
    firstLink
  );
  // Find other nics that could be in this bond. They need to be physical
  // interfaces on the same vlan that are not already in a bond or bridge.
  const validNics = machine.interfaces.filter(
    (networkInterface) =>
      networkInterface.vlan_id === vlan?.id &&
      networkInterface.type === NetworkInterfaceTypes.PHYSICAL &&
      !isBondOrBridgeParent(machine, networkInterface)
  );
  // When editing the bond members then display all valid nics, otherwise just
  // show the selected nics.
  const rows = editingMembers
    ? validNics.map(({ id, links }) => ({ nicId: id, linkId: links[0]?.id }))
    : selected;

  return (
    <FormCard sidebar={false} stacked title="Create bond">
      <FormikForm
        allowUnchanged
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          ...networkFieldsInitialValues,
          bond_downdelay: 0,
          bond_lacp_rate: "",
          bond_mode: BondMode.ACTIVE_BACKUP,
          bond_miimon: 0,
          bond_updelay: 0,
          bond_xmit_hash_policy: "",
          fabric: vlan?.fabric || "",
          linkMonitoring: "",
          mac_address: firstNic?.mac_address || "",
          name: nextName,
          primary: firstNic?.id.toString(),
          subnet: subnet?.id || "",
          tags: [],
          vlan: bondVLAN || "",
        }}
        onSaveAnalytics={{
          action: "Create bond",
          category: "Machine details networking",
          label: "Create bond form",
        }}
        onCancel={close}
        onSubmit={(values: BondFormValues) => {
          // Clear the errors from the previous submission.
          dispatch(cleanup());
          type Payload = BondFormValues & {
            parents: NetworkInterface["parents"];
            system_id: Machine["system_id"];
          };
          const primary = toFormikNumber(values.primary);
          const payload: Payload = {
            ...values,
            parents: primary ? generateParents(selected, primary) : [],
            system_id: systemId,
          };
          const { linkMonitoring } = values;
          Object.entries(payload).forEach(([key, value]) => {
            if (
              // Remove empty fields.
              value === "" ||
              // Remove fields that are not API values.
              key === "primary" ||
              key === "linkMonitoring" ||
              // Remove link monitoring fields if they're hidden.
              (linkMonitoring !== LinkMonitoring.MII &&
                ["bond_downdelay", "bond_miimon", "bond_updelay"].includes(key))
            ) {
              delete payload[key as keyof Payload];
            }
          });
          dispatch(machineActions.createBond(payload));
        }}
        resetOnSave
        saved={saved}
        saving={saving}
        submitDisabled={!hasEnoughNics}
        submitLabel="Save interface"
        validationSchema={InterfaceSchema}
      >
        <InterfaceFormTable
          editPrimary
          interfaces={rows}
          selected={selected}
          selectedEditable={editingMembers}
          setSelected={setSelected}
          systemId={systemId}
        />
        {generateToggleButton(
          editingMembers,
          validNics,
          selected,
          setEditingMembers
        )}
        <BondFormFields selected={selected} systemId={systemId} />
      </FormikForm>
    </FormCard>
  );
};

export default BondForm;
