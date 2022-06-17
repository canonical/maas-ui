import { Row, Col, Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";

type AddSpaceValues = {
  name: string;
};

const AddSpace = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const dispatch = useDispatch();
  const isSaving = useSelector(spaceSelectors.saving);
  const isSaved = useSelector(spaceSelectors.saved);
  const errors = useSelector(spaceSelectors.errors);

  return (
    <FormikForm<AddSpaceValues>
      allowAllEmpty
      aria-label="Add space"
      buttonsBordered={false}
      cleanup={spaceActions.cleanup}
      errors={errors}
      initialValues={{ name: "" }}
      onCancel={() => setActiveForm(null)}
      onSaveAnalytics={{
        action: "Add space",
        category: "Subnets form actions",
        label: "Add space",
      }}
      onSubmit={({ name }) => {
        dispatch(spaceActions.cleanup());
        dispatch(spaceActions.create({ name }));
      }}
      onSuccess={() => setActiveForm(null)}
      saved={isSaved}
      saving={isSaving}
      submitLabel={`Add ${activeForm}`}
    >
      <Row>
        <Col size={6}>
          <FormikField
            component={Input}
            disabled={isSaving}
            label="Name (optional)"
            name="name"
            takeFocus
            type="text"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddSpace;
