import { useCallback, useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BridgeFormFields from "../BridgeFormFields";
import InterfaceFormTable from "../InterfaceFormTable";
import {
  networkFieldsInitialValues,
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";

import type { BridgeFormValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import type { Selected } from "app/base/components/node/networking/types";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  CreateBridgeParams,
  MachineDetails,
} from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { BridgeType, NetworkInterfaceTypes } from "app/store/types/enum";
import { getNextNicName } from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { preparePayload } from "app/utils";

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
};

const AddBridgeForm = ({
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

  if (vlansLoading || !nic || !isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormCard sidebar={false} stacked title="Create bridge">
      <InterfaceFormTable interfaces={selected} systemId={systemId} />
      <Formik<BridgeFormValues>
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
        validationSchema={InterfaceSchema}
      >
        <FormikFormContent<BridgeFormValues, MachineEventErrors>
          allowUnchanged
          cleanup={cleanup}
          errors={errors}
          onSaveAnalytics={{
            action: "Create bridge",
            category: "Machine details networking",
            label: "Create bridge form",
          }}
          onCancel={close}
          resetOnSave
          saved={saved}
          saving={saving}
          submitLabel="Save interface"
        >
          <BridgeFormFields />
        </FormikFormContent>
      </Formik>
    </FormCard>
  );
};

export default AddBridgeForm;
