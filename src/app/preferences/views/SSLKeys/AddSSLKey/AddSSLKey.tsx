/* eslint-disable react/no-multi-comp */
import { Col, Row, Textarea } from "@canonical/react-components";
import type { TextareaProps } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";
import { actions as sslkeyActions } from "app/store/sslkey";
import sslkeySelectors from "app/store/sslkey/selectors";

export enum Label {
  Title = "Add SSL key",
  KeyField = "SSL key",
  SubmitLabel = "Save SSL key",
}

// This can be removed when the autoComplete prop is supported:
// https://github.com/canonical-web-and-design/react-components/issues/571
const ProxyTextarea = (
  props: TextareaProps & { autoComplete?: "off" | "on" }
) => <Textarea {...props} />;

const SSLKeySchema = Yup.object().shape({
  key: Yup.string().required("SSL key is required"),
});

export const AddSSLKey = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saving = useSelector(sslkeySelectors.saving);
  const saved = useSelector(sslkeySelectors.saved);
  const errors = useSelector(sslkeySelectors.errors);

  useWindowTitle(Label.Title);

  useAddMessage(saved, sslkeyActions.cleanup, "SSL key successfully added.");

  return (
    <FormCard title={Label.Title}>
      <FormikForm
        aria-label={Label.Title}
        cleanup={sslkeyActions.cleanup}
        errors={errors}
        initialValues={{ key: "" }}
        onCancel={() => navigate({ pathname: urls.preferences.sslKeys.index })}
        onSaveAnalytics={{
          action: "Saved",
          category: "SSL keys preferences",
          label: "Add SSL key form",
        }}
        onSubmit={(values) => {
          dispatch(sslkeyActions.create(values));
        }}
        saved={saved}
        savedRedirect={urls.preferences.sslKeys.index}
        saving={saving}
        submitLabel={Label.SubmitLabel}
        validationSchema={SSLKeySchema}
      >
        <Row>
          <Col size={5}>
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
          <Col size={3}>
            <p className="form-card__help">
              You will be able to access Windows winrm service with a registered
              key.
            </p>
          </Col>
        </Row>
      </FormikForm>
    </FormCard>
  );
};

export default AddSSLKey;
