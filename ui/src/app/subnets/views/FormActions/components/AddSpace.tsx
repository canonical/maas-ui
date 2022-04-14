import { Row, Col, Input } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
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
    <Formik
      initialValues={{ name: "" }}
      onSubmit={({ name }) => {
        dispatch(spaceActions.create({ name }));
      }}
    >
      <FormikFormContent<AddSpaceValues>
        aria-label="Add space"
        buttonsBordered={false}
        allowAllEmpty
        onSaveAnalytics={{
          action: "Add space",
          category: "Subnets form actions",
          label: "Add space",
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
              type="text"
              name="name"
              component={Input}
              disabled={isSaving}
              label="Name (optional)"
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default AddSpace;
