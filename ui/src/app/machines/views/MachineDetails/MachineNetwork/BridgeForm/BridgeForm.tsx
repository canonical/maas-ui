import { useCallback, useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import InterfaceFormTable from "../InterfaceFormTable";
import {
  networkFieldsInitialValues,
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";
import type { Selected } from "../NetworkTable/types";

import BridgeFormFields from "./BridgeFormFields";
import type { BridgeFormValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  MachineDetails,
  NetworkInterface,
} from "app/store/machine/types";
import { BridgeType, NetworkInterfaceTypes } from "app/store/machine/types";
import { getNextNicName } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  bridge_fd: Yup.number(),
  bridge_stp: Yup.boolean(),
  bridge_type: Yup.string().required("Bridge type is required"),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string().required("Name is required"),
  tags: Yup.array().of(Yup.string()),
});

type Props = {
  close: () => void;
  selected: Selected[];
  systemId: MachineDetails["system_id"];
};

const BridgeForm = ({
  close,
  selected,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const nextName = getNextNicName(machine, NetworkInterfaceTypes.BRIDGE);
  const [{ linkId, nicId }] = selected;
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingBridge",
    "createBridge",
    () => close()
  );

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  // A bridge can only be created with one interface.
  if (selected.length !== 1) {
    return null;
  }

  if (vlansLoading || !nic || !machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormCard sidebar={false} stacked title="Create bridge">
      <InterfaceFormTable interfaces={selected} systemId={systemId} />
      <FormikForm
        allowUnchanged
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          ...networkFieldsInitialValues,
          bridge_fd: "",
          bridge_stp: false,
          bridge_type: BridgeType.STANDARD,
          // Prefill the fabric from the parent interface.
          fabric: vlan?.fabric,
          mac_address: nic.mac_address,
          name: nextName,
          tags: [],
          // Prefill the vlan from the parent interface.
          vlan: nic.vlan_id,
        }}
        onSaveAnalytics={{
          action: "Create bridge",
          category: "Machine details networking",
          label: "Create bridge form",
        }}
        onCancel={close}
        onSubmit={(values: BridgeFormValues) => {
          // Clear the errors from the previous submission.
          dispatch(cleanup());
          type Payload = BridgeFormValues & {
            parents: NetworkInterface["parents"];
            system_id: Machine["system_id"];
          };
          const payload: Payload = {
            ...values,
            parents: [nic.id],
            system_id: systemId,
          };
          // Remove all empty values.
          Object.entries(payload).forEach(([key, value]) => {
            if (value === "") {
              delete payload[key as keyof Payload];
            }
          });
          dispatch(machineActions.createBridge(payload));
        }}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel="Save interface"
        validationSchema={InterfaceSchema}
      >
        <BridgeFormFields />
      </FormikForm>
    </FormCard>
  );
};

export default BridgeForm;
