import {
  Col,
  Row,
  Textarea,
  useOnEscapePressed,
} from "@canonical/react-components";
import type { TextareaProps } from "@canonical/react-components";
import { useNavigate } from "react-router";
import * as Yup from "yup";

import { useCreateSslKeys } from "@/app/api/query/sslKeys";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { sslkeyActions } from "@/app/store/sslkey";

export enum Label {
  Title = "Add SSL key",
  FormLabel = "Add SSL key form",
  KeyField = "SSL key",
  SubmitLabel = "Save SSL key",
}

// This can be removed when the autoComplete prop is supported:
// https://github.com/canonical/react-components/issues/571
const ProxyTextarea = (
  props: TextareaProps & { autoComplete?: "off" | "on" }
) => <Textarea {...props} />;

const SSLKeySchema = Yup.object().shape({
  key: Yup.string().required("SSL key is required"),
});

export const AddSSLKey = (): React.ReactElement => {
  const navigate = useNavigate();
  const uploadSslKey = useCreateSslKeys();
  const onCancel = () => navigate({ pathname: urls.preferences.sslKeys.index });
  useOnEscapePressed(() => onCancel());

  useAddMessage(
    uploadSslKey.isSuccess,
    sslkeyActions.cleanup,
    "SSL key successfully added."
  );

  return (
    <FormikForm
      aria-label={Label.FormLabel}
      errors={uploadSslKey.error}
      initialValues={{ key: "" }}
      onCancel={onCancel}
      onSaveAnalytics={{
        action: "Saved",
        category: "SSL keys preferences",
        label: "Add SSL key form",
      }}
      onSubmit={(values) => {
        if (values.key && values.key !== "") {
          uploadSslKey.mutate({
            body: {
              key: values.key,
            },
          });
        }
      }}
      saved={uploadSslKey.isSuccess}
      savedRedirect={urls.preferences.sslKeys.index}
      saving={uploadSslKey.isPending}
      submitLabel={Label.SubmitLabel}
      validationSchema={SSLKeySchema}
    >
      <Row>
        <Col size={12}>
          <FormikField
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="ssl-key-form-fields__key p-text--code"
            component={ProxyTextarea}
            label={Label.KeyField}
            name="key"
            spellCheck="false"
          />
        </Col>
        <Col size={12}>
          <p className="form-card__help">
            You will be able to access Windows winrm service with a registered
            key.
          </p>
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddSSLKey;
