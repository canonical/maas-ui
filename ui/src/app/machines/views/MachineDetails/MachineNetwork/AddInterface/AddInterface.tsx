import { useCallback } from "react";

import { Col, Input, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import NetworkFields from "../NetworkFields";
import {
  networkFieldsInitialValues,
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";
import type { NetworkValues } from "../NetworkFields/NetworkFields";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import MacAddressField from "app/base/components/MacAddressField";
import TagField from "app/base/components/TagField";
import { useScrollOnRender } from "app/base/hooks";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  CreatePhysicalParams,
  MachineDetails,
} from "app/store/machine/types";
import { getNextNicName, isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import { preparePayload } from "app/utils";

type Props = {
  close: () => void;
  systemId: MachineDetails["system_id"];
};

export type AddInterfaceValues = {
  mac_address: NetworkInterface["mac_address"];
  name?: NetworkInterface["name"];
  tags?: NetworkInterface["tags"];
} & NetworkValues;

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

const AddInterface = ({ close, systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const nextName = getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingPhysical",
    "createPhysical",
    () => close()
  );
  const onRenderRef = useScrollOnRender<HTMLDivElement>();

  if (!isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }
  return (
    <div ref={onRenderRef}>
      <FormCard sidebar={false}>
        <FormikForm<AddInterfaceValues>
          cleanup={cleanup}
          errors={errors}
          initialValues={{
            ...networkFieldsInitialValues,
            mac_address: "",
            name: nextName || "",
            tags: [],
          }}
          onSaveAnalytics={{
            action: "Add interface",
            category: "Machine details networking",
            label: "Add interface form",
          }}
          onCancel={close}
          onSubmit={(values) => {
            // Clear the errors from the previous submission.
            dispatch(cleanup());
            const payload = preparePayload({
              ...values,
              system_id: systemId,
            }) as CreatePhysicalParams;
            dispatch(machineActions.createPhysical(payload));
          }}
          resetOnSave
          saved={saved}
          saving={saving}
          submitLabel="Save interface"
          validateOnMount
          validationSchema={InterfaceSchema}
        >
          <Row>
            <Col size={6}>
              <FormikField label="Name" type="text" name="name" />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col size={6}>
              <Input
                disabled
                label="Type"
                value="Physical"
                type="text"
                name="type"
              />
              <MacAddressField label="MAC address" name="mac_address" />
              <TagField />
            </Col>
            <Col size={6}>
              <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
            </Col>
          </Row>
        </FormikForm>
      </FormCard>
    </div>
  );
};

export default AddInterface;
