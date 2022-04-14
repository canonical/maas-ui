import { Col, Row, Textarea } from "@canonical/react-components";
import type { TextareaProps } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";
import { actions as sslkeyActions } from "app/store/sslkey";
import sslkeySelectors from "app/store/sslkey/selectors";

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
  const history = useHistory();
  const saving = useSelector(sslkeySelectors.saving);
  const saved = useSelector(sslkeySelectors.saved);
  const errors = useSelector(sslkeySelectors.errors);

  useWindowTitle("Add SSL key");

  useAddMessage(saved, sslkeyActions.cleanup, "SSL key successfully added.");

  return (
    <FormCard title="Add SSL key">
      <Formik
        initialValues={{ key: "" }}
        onSubmit={(values) => {
          dispatch(sslkeyActions.create(values));
        }}
        validationSchema={SSLKeySchema}
      >
        <FormikFormContent
          cleanup={sslkeyActions.cleanup}
          errors={errors}
          onCancel={() => history.push({ pathname: prefsURLs.sslKeys.index })}
          onSaveAnalytics={{
            action: "Saved",
            category: "SSL keys preferences",
            label: "Add SSL key form",
          }}
          saving={saving}
          saved={saved}
          savedRedirect={prefsURLs.sslKeys.index}
          submitLabel="Save SSL key"
        >
          <Row>
            <Col size={5}>
              <FormikField
                className="ssl-key-form-fields__key p-text--code"
                component={ProxyTextarea}
                name="key"
                label="SSL key"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </Col>
            <Col size={3}>
              <p className="form-card__help">
                You will be able to access Windows winrm service with a
                registered key.
              </p>
            </Col>
          </Row>
        </FormikFormContent>
      </Formik>
    </FormCard>
  );
};

export default AddSSLKey;
