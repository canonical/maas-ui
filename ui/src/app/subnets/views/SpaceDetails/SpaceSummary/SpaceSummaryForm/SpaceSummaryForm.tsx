import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";

export type SpaceSummaryValues = Pick<Space, "name" | "description">;
const spaceSummaryFormSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string(),
});

const SpaceSummaryForm = ({
  space,
  handleDismiss,
}: {
  space: Space;
  handleDismiss: () => void;
}): JSX.Element => {
  const spaceErrors = useSelector(spaceSelectors.errors);
  const saving = useSelector(spaceSelectors.saving);
  const saved = useSelector(spaceSelectors.saved);
  const dispatch = useDispatch();

  return (
    <FormikForm<SpaceSummaryValues>
      aria-label="Edit space summary"
      cleanup={spaceActions.cleanup}
      errors={spaceErrors}
      initialValues={{
        description: space.description,
        name: space.name,
      }}
      onCancel={handleDismiss}
      onSaveAnalytics={{
        action: "Save",
        category: "Space",
        label: "Space summary form",
      }}
      onSubmit={({ name, description }) => {
        dispatch(spaceActions.update({ description, id: space.id, name }));
      }}
      onSuccess={() => {
        handleDismiss();
      }}
      resetOnSave
      saving={saving}
      saved={saved}
      submitLabel="Save"
      validationSchema={spaceSummaryFormSchema}
    >
      <Row>
        <Col size={6}>
          <FormikField label="Name" name="name" type="text" />
          <FormikField label="Description" name="description" type="text" />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default SpaceSummaryForm;
