import { Col, Row } from "@canonical/react-components";

import type { Props as FormikFormProps } from "app/base/components/FormikForm/FormikForm";
import FormikForm from "app/base/components/FormikForm/FormikForm";
import type { EmptyObject } from "app/base/types";

type Props = {
  modelType: string;
  message?: string;
} & FormikFormProps<EmptyObject>;

const ModelDeleteForm = ({
  modelType,
  message,
  submitAppearance = "negative",
  submitLabel = "Delete",
  initialValues = {},
  ...props
}: Props) => {
  return (
    <FormikForm
      initialValues={initialValues}
      submitAppearance={submitAppearance}
      submitLabel={submitLabel}
      {...props}
    >
      <Row>
        <Col size={12}>
          <p className="u-nudge-down--small">
            {message
              ? message
              : `Are you sure you want to delete this ${modelType}?`}
          </p>
          <span className="u-text--light">
            This action is permanent and can not be undone.
          </span>
        </Col>
      </Row>
    </FormikForm>
  );
};

export default ModelDeleteForm;
