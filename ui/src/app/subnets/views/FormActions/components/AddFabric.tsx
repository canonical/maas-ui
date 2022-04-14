import { Row, Col, Input } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";

type AddFabricValues = {
  name: string;
  description: string;
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
    <Formik
      initialValues={{ name: "", description: "" }}
      onSubmit={({ name, description }) => {
        dispatch(fabricActions.create({ name, description }));
      }}
    >
      <FormikFormContent<AddFabricValues>
        aria-label="Add fabric"
        buttonsBordered={false}
        allowAllEmpty
        cleanup={fabricActions.cleanup}
        onSaveAnalytics={{
          action: "Add fabric",
          category: "Subnets form actions",
          label: "Add fabric",
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
          <Col size={6}>
            <FormikField
              type="text"
              name="description"
              component={Input}
              disabled={isSaving}
              label="Description (optional)"
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default AddFabric;
