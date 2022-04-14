import { useCallback } from "react";

import { Col, Row, Spinner, Textarea } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import VLANControllers from "../VLANSummary/VLANControllers";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import SpaceSelect from "app/base/components/SpaceSelect";
import type { RootState } from "app/store/root/types";
import { getSpaceDisplay } from "app/store/space/utils";
import { VLANMTURange, VLANVidRange } from "app/store/types/enum";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

type Props = {
  close: () => void;
  id: VLAN[VLANMeta.PK];
};

export type FormValues = {
  description: VLAN["description"];
  fabric: VLAN["fabric"];
  mtu: VLAN["mtu"];
  name: VLAN["name"];
  space?: VLAN["space"];
  vid: VLAN["vid"];
};

const mtuHelp = `MTU must be between ${VLANMTURange.Min} and ${VLANMTURange.Max}`;
const vidHelp = `Vid must be between ${VLANVidRange.Min} and ${VLANVidRange.Max}`;

const Schema = Yup.object().shape({
  description: Yup.string(),
  fabric: Yup.number().required("Fabric is required"),
  mtu: Yup.number()
    .min(VLANMTURange.Min, mtuHelp)
    .max(VLANMTURange.Max, mtuHelp),
  name: Yup.string(),
  space: Yup.number(),
  vid: Yup.number()
    .min(VLANVidRange.Min, vidHelp)
    .max(VLANVidRange.Max, vidHelp)
    .required("VID is required"),
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
  const initialValues: FormValues = {
    description: vlan.description,
    fabric: vlan.fabric,
    mtu: vlan.mtu,
    name: vlan.name,
    vid: vlan.vid,
  };
  if (isId(vlan.space)) {
    initialValues.space = vlan.space;
  }
  return (
    <Formik
      initialValues={initialValues}
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
      validationSchema={Schema}
    >
      <FormikFormContent<FormValues>
        aria-label="Edit VLAN"
        cleanup={cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: "Save VLAN",
          category: "VLAN details",
          label: "Edit VLAN form",
        }}
        onCancel={close}
        onSuccess={() => close()}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel="Save summary"
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
            <SpaceSelect
              defaultOption={{ label: getSpaceDisplay(null), value: "" }}
              name="space"
            />
            <FabricSelect defaultOption={null} name="fabric" />
            <VLANControllers id={id} />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default EditVLAN;
