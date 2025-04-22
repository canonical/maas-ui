import { Row, Col, Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { fabricActions } from "@/app/store/fabric";
import fabricSelectors from "@/app/store/fabric/selectors";

type AddFabricValues = {
  name: string;
  description: string;
};

const AddFabric = ({
  activeForm,
  setActiveForm,
}: FormActionProps): React.ReactElement => {
  const dispatch = useDispatch();
  const isSaving = useSelector(fabricSelectors.saving);
  const isSaved = useSelector(fabricSelectors.saved);
  const errors = useSelector(fabricSelectors.errors);

  return (
    <FormikForm<AddFabricValues>
      allowAllEmpty
      aria-label="Add fabric"
      cleanup={fabricActions.cleanup}
      errors={errors}
      initialValues={{ name: "", description: "" }}
      onCancel={() => setActiveForm(null)}
      onSaveAnalytics={{
        action: "Add fabric",
        category: "Subnets form actions",
        label: "Add fabric",
      }}
      onSubmit={({ name, description }) => {
        dispatch(fabricActions.cleanup());
        dispatch(fabricActions.create({ name, description }));
      }}
      onSuccess={() => setActiveForm(null)}
      saved={isSaved}
      saving={isSaving}
      submitLabel={`Add ${activeForm}`}
    >
      <Row>
        <Col size={12}>
          <FormikField
            component={Input}
            disabled={isSaving}
            label="Name (optional)"
            name="name"
            type="text"
          />
        </Col>
        <Col size={12}>
          <FormikField
            component={Input}
            disabled={isSaving}
            label="Description (optional)"
            name="description"
            type="text"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddFabric;
