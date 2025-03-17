import { useCallback } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BridgeFormFields from "../BridgeFormFields";
import InterfaceFormTable from "../InterfaceFormTable";
import {
  networkFieldsInitialValues,
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";

import type { BridgeFormValues } from "./types";

import FormikForm from "@/app/base/components/FormikForm";
import type {
  Selected,
  SetSelected,
} from "@/app/base/components/node/networking/types";
import { useFetchActions } from "@/app/base/hooks";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type {
  CreateBridgeParams,
  MachineDetails,
} from "@/app/store/machine/types";
import type { MachineEventErrors } from "@/app/store/machine/types/base";
import { isMachineDetails } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import { BridgeType, NetworkInterfaceTypes } from "@/app/store/types/enum";
import { getNextNicName } from "@/app/store/utils";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import { preparePayload } from "@/app/utils";

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  bridge_fd: Yup.number(),
  bridge_stp: Yup.boolean(),
  bridge_type: Yup.string().required("Bridge type is required"),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

type Props = {
  close: () => void;
  selected: Selected[];
  systemId: MachineDetails["system_id"];
  setSelected: SetSelected;
};

const AddBridgeForm = ({
  close,
  selected,
  systemId,
  setSelected,
}: Props): React.ReactElement | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const handleClose = () => {
    setSelected([]);
    close();
  };
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
    () => handleClose()
  );

  useFetchActions([vlanActions.fetch]);

  // A bridge can only be created with one interface.
  if (selected.length !== 1) {
    return null;
  }

  if (vlansLoading || !nic || !isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <InterfaceFormTable interfaces={selected} systemId={systemId} />
      <FormikForm<BridgeFormValues, MachineEventErrors>
        allowUnchanged
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          ...networkFieldsInitialValues,
          bridge_fd: "",
          bridge_stp: false,
          bridge_type: BridgeType.STANDARD,
          // Prefill the fabric from the parent interface.
          fabric: vlan?.fabric || "",
          mac_address: nic.mac_address,
          name: nextName || "",
          tags: [],
          // Prefill the vlan from the parent interface.
          vlan: nic.vlan_id,
        }}
        onCancel={handleClose}
        onSaveAnalytics={{
          action: "Create bridge",
          category: "Machine details networking",
          label: "Create bridge form",
        }}
        onSubmit={(values) => {
          // Clear the errors from the previous submission.
          dispatch(cleanup());
          const payload = preparePayload({
            ...values,
            parents: [nic.id],
            system_id: systemId,
          }) as CreateBridgeParams;
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
    </>
  );
};

export default AddBridgeForm;
