import { useCallback, useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddInterfaceFormFields from "./AddInterfaceFormFields";
import type { AddInterfaceValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineDetails } from "app/store/machine/types";
import {
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";
import { getNextNicName } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  close: () => void;
  systemId: MachineDetails["system_id"];
};

const InterfaceSchema = Yup.object().shape({
  ip_address: Yup.string(),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  mode: Yup.mixed().oneOf(Object.values(NetworkLinkMode)),
  name: Yup.string(),
  fabric: Yup.number().required("Fabric is required"),
  subnet: Yup.number(),
  tags: Yup.array().of(Yup.string()),
  vlan: Yup.number().required("VLAN is required"),
});

const AddInterface = ({ close, systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const nextName = getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingPhysical",
    "createPhysical",
    () => close()
  );

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (
    !machine ||
    !("interfaces" in machine) ||
    !vlansLoaded ||
    !fabricsLoaded
  ) {
    return <Spinner text="Loading..." />;
  }
  return (
    <FormCard sidebar={false}>
      <FormikForm
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          ip_address: "",
          mac_address: "",
          mode: NetworkLinkMode.LINK_UP,
          name: nextName,
          fabric: fabrics[0]?.id,
          subnet: "",
          tags: [],
          vlan: vlans[0]?.id,
        }}
        onSaveAnalytics={{
          action: "Add interface",
          category: "Machine details networking",
          label: "Add interface form",
        }}
        onCancel={close}
        onSubmit={(values: AddInterfaceValues) => {
          // Clear the errors from the previous submission.
          dispatch(cleanup());
          type Payload = AddInterfaceValues & {
            system_id: Machine["system_id"];
          };
          const payload: Payload = {
            ...values,
            system_id: systemId,
          };
          // Remove all empty values.
          Object.entries(payload).forEach(([key, value]) => {
            if (value === "") {
              delete payload[key as keyof Payload];
            }
          });
          dispatch(machineActions.createPhysical(payload));
        }}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel="Save interface"
        validationSchema={InterfaceSchema}
      >
        <AddInterfaceFormFields />
      </FormikForm>
    </FormCard>
  );
};

export default AddInterface;
