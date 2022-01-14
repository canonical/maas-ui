import { useEffect } from "react";

import { Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { FormActionProps } from "../FormActions";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import SpaceSelect from "app/base/components/SpaceSelect";
import { actions as fabricActions } from "app/store/fabric";
import { actions as spaceActions } from "app/store/space";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { toFormikNumber } from "app/utils";

type AddVlanValues = {
  name?: string;
  fabric?: number;
  vid?: number;
  space?: number;
};

const vlanSchema = Yup.object()
  .shape({
    space: Yup.number().required("Space is required"),
    fabric: Yup.number().required("Fabric is required"),
    name: Yup.string(),
    vid: Yup.number().required("VID is required"),
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

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(spaceActions.fetch());
  }, [dispatch]);

  return (
    <FormikForm<AddVlanValues>
      validationSchema={vlanSchema}
      buttonsBordered={false}
      allowAllEmpty
      initialValues={{ vid: undefined }}
      onSaveAnalytics={{
        action: "Add VLAN",
        category: "Subnets form actions",
        label: "Add VLAN",
      }}
      submitLabel={`Add ${activeForm}`}
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
      onCancel={() => setActiveForm(null)}
      onSuccess={() => setActiveForm(null)}
      saving={isSaving}
      saved={isSaved}
      errors={errors}
    >
      <FormikField
        takeFocus
        required
        type="text"
        name="vid"
        component={Input}
        disabled={isSaving}
        label="VID"
      />
      <FormikField
        type="text"
        name="name"
        component={Input}
        disabled={isSaving}
        label="Name"
      />
      <FabricSelect required name="fabric" disabled={isSaving} />
      <SpaceSelect required name="space" disabled={isSaving} />
    </FormikForm>
  );
};

export default AddVlan;
