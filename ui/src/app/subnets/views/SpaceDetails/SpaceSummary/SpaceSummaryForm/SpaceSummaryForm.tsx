import { Col, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";

export type SpaceSummaryValues = Pick<Space, "name" | "description">;
const spaceSummaryFormSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
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
    <Formik
      initialValues={{
        name: space.name,
        description: space.description,
      }}
      onSubmit={({ name, description }) => {
        dispatch(spaceActions.update({ id: space.id, name, description }));
      }}
      validationSchema={spaceSummaryFormSchema}
    >
      <FormikFormContent<SpaceSummaryValues>
        aria-label="Edit space summary"
        cleanup={spaceActions.cleanup}
        errors={spaceErrors}
        onCancel={handleDismiss}
        onSaveAnalytics={{
          action: "Save",
          category: "Space",
          label: "Space summary form",
        }}
        onSuccess={() => {
          handleDismiss();
        }}
        resetOnSave
        saving={saving}
        saved={saved}
        submitLabel="Save"
      >
        <Row>
          <Col size={6}>
            <FormikField label="Name" name="name" type="text" />
            <FormikField label="Description" name="description" type="text" />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default SpaceSummaryForm;
