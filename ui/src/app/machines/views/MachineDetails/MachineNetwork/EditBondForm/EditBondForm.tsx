import { useCallback, useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BondFormFields from "../BondForm/BondFormFields";
import ToggleMembers from "../BondForm/ToggleMembers";
import type { BondFormValues } from "../BondForm/types";
import { LinkMonitoring } from "../BondForm/types";
import { getParentIds, getValidNics, preparePayload } from "../BondForm/utils";
import InterfaceFormTable from "../InterfaceFormTable";
import { networkFieldsSchema } from "../NetworkFields/NetworkFields";
import type { Selected, SetSelected } from "../NetworkTable/types";

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
  MachineDetails,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getInterfaceIPAddress,
  getInterfaceSubnet,
  getLinkMode,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { arrayItemsEqual } from "app/utils";

type Props = {
  close: () => void;
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
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

const EditBondForm = ({
  close,
  link,
  nic,
  selected,
  setSelected,
  systemId,
}: Props): JSX.Element | null => {
  const [editingMembers, setEditingMembers] = useState(false);
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const hasEnoughNics = selected.length > 1;
  const closeForm = () => {
    close();
    setSelected([]);
  };
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingInterface",
    "updateInterface",
    () => closeForm()
  );

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    // Set the bond parents as selected so that they appear in the table and the
    // parents can be edited.
    if (nic) {
      setSelected(
        nic.parents.map((id) => ({
          nicId: id,
        }))
      );
    }
  }, [setSelected, nic]);

  if (
    !nic ||
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
    nic,
    link
  );
  const validNics = getValidNics(machine, vlan?.id, nic);

  // When editing the bond members then display all valid nics, otherwise just
  // show the selected nics.
  const rows = editingMembers
    ? validNics.map(({ id, links }) => ({ nicId: id, linkId: links[0]?.id }))
    : selected;
  const ipAddress = getInterfaceIPAddress(machine, fabrics, vlans, nic, link);
  const linkMonitoring =
    nic.params?.bond_downdelay ||
    nic.params?.bond_updelay ||
    nic.params?.bond_miimon
      ? LinkMonitoring.MII
      : "";
  const selectedIds = getParentIds(selected);
  const membersHaveChanged = !arrayItemsEqual(selectedIds, nic.parents);

  return (
    <FormikForm
      allowUnchanged={membersHaveChanged}
      buttons={FormCardButtons}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        bond_downdelay: nic.params?.bond_downdelay,
        bond_lacp_rate: nic.params?.bond_lacp_rate,
        bond_miimon: nic.params?.bond_miimon,
        bond_mode: BondMode.ACTIVE_BACKUP,
        bond_updelay: nic.params?.bond_updelay,
        bond_xmit_hash_policy: nic.params?.bond_xmit_hash_policy,
        fabric: vlan ? vlan.fabric : "",
        ip_address: ipAddress,
        linkMonitoring,
        mac_address: nic.mac_address || "",
        mode: getLinkMode(link),
        name: nic.name,
        subnet: subnet ? subnet.id : "",
        tags: nic.tags,
        vlan: nic.vlan_id,
      }}
      onSaveAnalytics={{
        action: "Save bond",
        category: "Machine details networking",
        label: "Edit bond form",
      }}
      onCancel={closeForm}
      onSubmit={(values: BondFormValues) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        const payload = preparePayload(values, selected, systemId, nic, link);
        dispatch(machineActions.updateInterface(payload));
      }}
      resetOnSave
      saved={saved}
      saving={saving}
      submitDisabled={!hasEnoughNics}
      submitLabel="Save interface"
      validationSchema={InterfaceSchema}
    >
      <InterfaceFormTable
        interfaces={rows}
        selected={selected}
        selectedEditable={editingMembers}
        setSelected={setSelected}
        systemId={systemId}
      />
      <ToggleMembers
        editingMembers={editingMembers}
        selected={selected}
        setEditingMembers={setEditingMembers}
        validNics={validNics}
      />
      <BondFormFields />
    </FormikForm>
  );
};

export default EditBondForm;
