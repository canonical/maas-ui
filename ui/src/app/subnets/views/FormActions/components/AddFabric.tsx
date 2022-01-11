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

const AddFabric = ({ activeForm, setActiveForm }: FormActionProps) => {
  const dispatch = useDispatch();
  const isSaving = useSelector(fabricSelectors.saving);
  const isSaved = useSelector(fabricSelectors.saved);
  const errors = useSelector(fabricSelectors.errors);

  return (
    <FormikForm<AddFabricValues>
      buttonsBordered={false}
      initialValues={{ name: "" }}
      onSaveAnalytics={{
        action: "Add fabric",
        category: "Subnets form actions",
        label: "Create fabric",
      }}
      submitLabel={`Add ${activeForm}`}
      onSubmit={({ name }: { name?: string }) => {
        dispatch(fabricActions.create({ name }));
      }}
      onCancel={() => setActiveForm(undefined)}
      resetOnSave
      saving={isSaving}
      saved={isSaved}
      errors={errors}
    >
      <hr />
      <FormikField
        takeFocus
        stacked
        type="text"
        name="name"
        component={Input}
        disabled={isSaving}
        label="Name (optional)"
        placeholder="Name (optional)"
      />
    </FormikForm>
  );
};

export default AddFabric;
