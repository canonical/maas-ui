import { Col, Row, Textarea } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React from "react";

import { sslkey as sslkeyActions } from "app/preferences/actions";
import { sslkey as sslkeySelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import FormikField from "app/base/components/FormikField";
import FormCardButtons from "app/base/components/FormCardButtons";

const SSLKeySchema = Yup.object().shape({
  key: Yup.string().required("SSL key is required")
});

export const AddSSLKey = () => {
  const saving = useSelector(sslkeySelectors.saving);
  const saved = useSelector(sslkeySelectors.saved);
  const errors = useSelector(sslkeySelectors.errors);
  const dispatch = useDispatch();

  useWindowTitle("Add SSL key");

  useAddMessage(saved, sslkeyActions.cleanup, "SSL key successfully added.");

  return (
    <FormCard title="Add SSL key">
      <FormikForm
        buttons={FormCardButtons}
        cleanup={sslkeyActions.cleanup}
        errors={errors}
        initialValues={{ key: "" }}
        onSaveAnalytics={{
          action: "Saved",
          category: "SSL keys preferences",
          label: "Add SSL key form"
        }}
        onSubmit={values => {
          dispatch(sslkeyActions.create(values));
        }}
        saving={saving}
        saved={saved}
        savedRedirect="/account/prefs/ssl-keys"
        submitLabel="Save SSL key"
        validationSchema={SSLKeySchema}
      >
        <Row>
          <Col size="5">
            <FormikField
              className="ssl-key-form-fields__key"
              component={Textarea}
              name="key"
              label="SSL key"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </Col>
          <Col size="3">
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
