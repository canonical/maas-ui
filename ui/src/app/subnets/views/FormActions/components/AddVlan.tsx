import { useEffect } from "react";

import { Row, Col, Input } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { FormActionProps } from "../FormActions";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import SpaceSelect from "app/base/components/SpaceSelect";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { getSpaceDisplay } from "app/store/space/utils";
import { VLANVidRange } from "app/store/types/enum";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { toFormikNumber } from "app/utils";

type AddVlanValues = {
  vid: string;
  name: string;
  fabric: string;
  space: string;
};

const vidRangeError = "VID must be a numeric value between 1 and 4094";
const vlanSchema = Yup.object()
  .shape({
    space: Yup.number(),
    fabric: Yup.number().required("Fabric is required"),
    name: Yup.string(),
    vid: Yup.number()
      .typeError(vidRangeError)
      .min(VLANVidRange.Min, vidRangeError)
      .max(VLANVidRange.Max, vidRangeError)
      .required("VID is required"),
  })
  .defined();

const AddVlan = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const dispatch = useDispatch();
  const isSaving = useSelector(vlanSelectors.saving);
  const isSaved = useSelector(vlanSelectors.saved);
  const errors = useSelector(vlanSelectors.errors);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
    if (!spacesLoaded) dispatch(spaceActions.fetch());
  }, [dispatch, fabricsLoaded, spacesLoaded]);

  return (
    <Formik
      initialValues={{
        vid: "",
        name: "",
        fabric: "",
        space: "",
      }}
      onSubmit={({ name, fabric, vid, space }) => {
        dispatch(
          vlanActions.create({
            name,
            fabric: toFormikNumber(fabric),
            vid: toFormikNumber(vid) as number,
            space: toFormikNumber(space),
          })
        );
      }}
      validationSchema={vlanSchema}
    >
      <FormikFormContent<AddVlanValues>
        aria-label="Add VLAN"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Add VLAN",
          category: "Subnets form actions",
          label: "Add VLAN",
        }}
        submitLabel={`Add ${activeForm}`}
        onCancel={() => setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
        saving={isSaving}
        saved={isSaved}
        errors={errors}
      >
        <Row>
          <Col size={6}>
            <FormikField
              takeFocus
              required
              type="text"
              name="vid"
              component={Input}
              disabled={isSaving}
              label="VID"
              help={`Numeric value between ${VLANVidRange.Min} and ${VLANVidRange.Max}`}
            />
          </Col>
          <Col size={6}>
            <FormikField
              type="text"
              name="name"
              component={Input}
              disabled={isSaving}
              label="Name"
            />
          </Col>
        </Row>
        <Row>
          <Col size={6}>
            <FabricSelect required name="fabric" disabled={isSaving} />
          </Col>
          <Col size={6}>
            <SpaceSelect
              defaultOption={{ label: getSpaceDisplay(null), value: "" }}
              disabled={isSaving}
              name="space"
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default AddVlan;
