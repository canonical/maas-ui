import { Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";

type AddFabricValues = {
  name: string;
};

const AddFabric = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const dispatch = useDispatch();
  const isSaving = useSelector(fabricSelectors.saving);
  const isSaved = useSelector(fabricSelectors.saved);
  const errors = useSelector(fabricSelectors.errors);

  return (
    <FormikForm<AddFabricValues>
      buttonsBordered={false}
      allowAllEmpty
      initialValues={{ name: "" }}
      onSaveAnalytics={{
        action: "Add fabric",
        category: "Subnets form actions",
        label: "Add fabric",
      }}
      submitLabel={`Add ${activeForm}`}
      onSubmit={({ name }) => {
        dispatch(fabricActions.create({ name }));
      }}
      onCancel={() => setActiveForm(null)}
      resetOnSave
      saving={isSaving}
      saved={isSaved}
      errors={errors}
    >
      <FormikField
        takeFocus
        type="text"
        name="name"
        component={Input}
        disabled={isSaving}
        label="Name (optional)"
      />
    </FormikForm>
  );
};

export default AddFabric;
