import { useEffect } from "react";

import { Row, Col, Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { FormActionProps } from "../FormActions";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
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
    <FormikForm<AddVlanValues>
      aria-label="Add VLAN"
      buttonsBordered={false}
      cleanup={vlanActions.cleanup}
      errors={errors}
      initialValues={{
        vid: "",
        name: "",
        fabric: "",
        space: "",
      }}
      onCancel={() => setActiveForm(null)}
      onSaveAnalytics={{
        action: "Add VLAN",
        category: "Subnets form actions",
        label: "Add VLAN",
      }}
      onSubmit={({ name, fabric, vid, space }) => {
        dispatch(vlanActions.cleanup());
        dispatch(
          vlanActions.create({
            name,
            fabric: toFormikNumber(fabric),
            vid: toFormikNumber(vid) as number,
            space: toFormikNumber(space),
          })
        );
      }}
      onSuccess={() => setActiveForm(null)}
      saved={isSaved}
      saving={isSaving}
      submitLabel={`Add ${activeForm}`}
      validationSchema={vlanSchema}
    >
      <Row>
        <Col size={12}>
          <FormikField
            component={Input}
            disabled={isSaving}
            help={`Numeric value between ${VLANVidRange.Min} and ${VLANVidRange.Max}`}
            label="VID"
            name="vid"
            required
            type="text"
          />
        </Col>
        <Col size={12}>
          <FormikField
            component={Input}
            disabled={isSaving}
            label="Name"
            name="name"
            type="text"
          />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <FabricSelect disabled={isSaving} name="fabric" required />
        </Col>
        <Col size={12}>
          <SpaceSelect
            defaultOption={{ label: getSpaceDisplay(null), value: "" }}
            disabled={isSaving}
            name="space"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddVlan;
