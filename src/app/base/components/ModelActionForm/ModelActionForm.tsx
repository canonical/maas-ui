import type { ReactNode } from "react";

import { Col, Row } from "@canonical/react-components";

import type { Props as FormikFormProps } from "@/app/base/components/FormikForm/FormikForm";
import FormikForm from "@/app/base/components/FormikForm/FormikForm";

type Props<V extends object, E = null> = FormikFormProps<V, E> & {
  modelType: string;
  message?: ReactNode;
};

const ModelActionForm = <V extends object, E = null>({
  modelType,
  message,
  submitAppearance = "negative",
  submitLabel = "Delete",
  initialValues,
  ...props
}: Props<V, E>) => {
  return (
    <FormikForm<V, E>
      initialValues={initialValues}
      submitAppearance={submitAppearance}
      submitLabel={submitLabel}
      {...props}
    >
      <Row>
        <Col size={12}>
          <p className="u-nudge-down--small">
            {message ? (
              message
            ) : (
              <>
                Are you sure you want to delete this {modelType}? This action is
                permanent and can not be undone.
              </>
            )}
          </p>
        </Col>
      </Row>
    </FormikForm>
  );
};

export default ModelActionForm;
