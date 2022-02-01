import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";

export type SpaceSummaryValues = Pick<Space, "name" | "description">;
const spaceSummaryFormSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
});

const SpaceSummaryFormFields = () => {
  return (
    <>
      <FormikField label="Name" name="name" type="text" />
      <FormikField label="Description" name="description" type="text" />
    </>
  );
};

const SpaceSummaryForm = ({
  handleDismiss,
}: {
  handleDismiss: () => void;
}): JSX.Element => {
  const space = useSelector(spaceSelectors.active);
  const spaceErrors = useSelector(spaceSelectors.errors);
  const saving = useSelector(spaceSelectors.saving);
  const saved = useSelector(spaceSelectors.saved);
  const dispatch = useDispatch();
  return (
    <FormikForm<SpaceSummaryValues>
      cleanup={spaceActions.cleanup}
      errors={spaceErrors}
      initialValues={{
        name: space?.name || "",
        description: space?.description || "",
      }}
      onSaveAnalytics={{
        action: "Save",
        category: "Space",
        label: "Space summary form",
      }}
      onSubmit={(values) => {
        if (space) dispatch(spaceActions.update({ id: space.id, ...values }));
      }}
      onSuccess={() => {
        handleDismiss();
      }}
      resetOnSave
      saving={saving}
      saved={saved}
      submitLabel="Save summary"
      onCancel={handleDismiss}
      validationSchema={spaceSummaryFormSchema}
    >
      <SpaceSummaryFormFields />
    </FormikForm>
  );
};

export default SpaceSummaryForm;
