import { useDispatch, useSelector } from "react-redux";

import { Input } from "@canonical/react-components";

import FormikForm from "app/base/components/FormikForm";
import FormikField from "app/base/components/FormikField";

import { actions as fabricActions } from "app/store/fabric";
import type { FormActionProps } from "../FormActions";
import fabricSelectors from "app/store/fabric/selectors";

type AddFabricValues = {
  name: string;
};

const AddFabric = ({ activeForm, setActiveForm }: FormActionProps) => {
  const dispatch = useDispatch();
  const isSaving = useSelector(fabricSelectors.saving);
  const isSaved = useSelector(fabricSelectors.saved);

  return (
    <FormikForm<AddFabricValues>
      buttonsBordered={true}
      initialValues={{ name: "" }}
      submitLabel={`Add ${activeForm}`}
      onSubmit={({ name }: { name?: string }) => {
        dispatch(fabricActions.create({ name }));
      }}
      onCancel={() => setActiveForm(undefined)}
      resetOnSave
      saving={isSaving}
      saved={isSaved}
    >
      <hr />
      <FormikField
        autoFocus
        type="text"
        name="name"
        component={Input}
        disabled={isSaving}
        label="Add fabric"
        placeholder="Name (optional)"
      />
    </FormikForm>
  );
};

export default AddFabric;
