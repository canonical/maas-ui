import { useCallback } from "react";

import { Col, Row, Spinner, Textarea } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import VLANControllers from "../VLANSummary/VLANControllers";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { Props as FormikFormProps } from "app/base/components/FormikForm/FormikForm";
import SpaceSelect from "app/base/components/SpaceSelect";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { VLANMeta } from "app/store/vlan/types";

type Props = {
  close: () => void;
  id: VLAN[VLANMeta.PK];
} & Partial<FormikFormProps<FormValues>>;

export type FormValues = {
  description: VLAN["description"];
  fabric: VLAN["fabric"];
  mtu: VLAN["mtu"];
  name: VLAN["name"];
  space: VLAN["space"];
  vid: VLAN["vid"];
};

const Schema = Yup.object().shape({
  description: Yup.string(),
  fabric: Yup.number(),
  mtu: Yup.number(),
  name: Yup.string(),
  space: Yup.number(),
  vid: Yup.number().required("VID is required"),
});

const EditVLAN = ({ close, id, ...props }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const saved = useSelector(vlanSelectors.saved);
  const saving = useSelector(vlanSelectors.saving);
  const errors = useSelector(vlanSelectors.errors);
  const cleanup = useCallback(() => vlanActions.cleanup(), []);

  if (!vlan) {
    return (
      <span data-testid="Spinner">
        <Spinner text="Loading..." />
      </span>
    );
  }
  return (
    <FormikForm<FormValues>
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        description: vlan.description,
        fabric: vlan.fabric,
        mtu: vlan.mtu,
        name: vlan.name,
        space: vlan.space,
        vid: vlan.vid,
      }}
      onSaveAnalytics={{
        action: "Save VLAN",
        category: "VLAN details",
        label: "Edit VLAN form",
      }}
      onCancel={close}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        dispatch(
          vlanActions.update({
            [VLANMeta.PK]: vlan[VLANMeta.PK],
            ...values,
          })
        );
      }}
      onSuccess={() => close()}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel="Save summary"
      validationSchema={Schema}
      {...props}
    >
      <Row>
        <Col size={6}>
          <FormikField label="VID" name="vid" required type="text" />
          <FormikField label="Name" name="name" type="text" />
          <FormikField label="MTU" name="mtu" type="text" />
          <FormikField
            component={Textarea}
            label="Description"
            name="description"
          />
        </Col>
        <Col size={6}>
          <SpaceSelect defaultOption={null} name="space" />
          <FabricSelect defaultOption={null} name="fabric" />
          <VLANControllers id={id} />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default EditVLAN;
