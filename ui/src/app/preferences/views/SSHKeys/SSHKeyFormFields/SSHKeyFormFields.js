import {
  Col,
  Form,
  Link,
  Notification,
  Row,
  Select,
  Textarea
} from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { formikFormDisabled } from "app/settings/utils";
import { sshkey as sshkeySelectors } from "app/preferences/selectors";
import { useFormikErrors } from "app/base/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";

export const SSHKeyFormFields = ({ editing, formikProps }) => {
  const saving = useSelector(sshkeySelectors.saving);
  const saved = useSelector(sshkeySelectors.saved);
  const errors = useSelector(sshkeySelectors.errors);
  useFormikErrors(errors, formikProps);
  let sshkeyErrors;
  if (errors) {
    if (typeof errors === "string") {
      sshkeyErrors = errors;
    } else if (errors["__all__"]) {
      sshkeyErrors = errors["__all__"].join(" ");
    }
  }
  const { protocol } = formikProps.values;
  const uploadSelected = protocol === "upload";

  return (
    <>
      {sshkeyErrors && (
        <Notification type="negative" status="Error:">
          {sshkeyErrors}
        </Notification>
      )}
      <Form onSubmit={formikProps.handleSubmit}>
        <Row>
          <Col size="4">
            <FormikField
              component={Select}
              formikProps={formikProps}
              fieldKey="protocol"
              label="Source"
              options={[
                { value: "", label: "Select source" },
                { value: "lp", label: "Launchpad" },
                { value: "gh", label: "GitHub" },
                { value: "upload", label: "Upload" }
              ]}
            />
            {protocol && !uploadSelected && (
              <FormikField
                formikProps={formikProps}
                fieldKey="auth_id"
                label={protocol === "lp" ? "Launchpad ID" : "GitHub username"}
                required={true}
                type="text"
              />
            )}
            {uploadSelected && (
              <FormikField
                component={Textarea}
                formikProps={formikProps}
                fieldKey="key"
                help="Usually at ~/.ssh/id_rsa.pub, ~/.ssh/id_dsa.pub, or ~/.ssh/id_ecdsa.pub"
                label={
                  <>
                    Public key{" "}
                    <span className="p-tooltip">
                      <i className="p-icon--help"></i>
                      <span className="p-tooltip__message" role="tooltip">
                        Begins with 'ssh-rsa', 'ssh-dss', 'ssh-ed25519',
                        'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or
                        'ecdsa-sha2-nistp521'
                      </span>
                    </span>
                  </>
                }
                style={{ minHeight: "10rem" }}
              />
            )}
          </Col>
          <Col size="4">
            <p className="p-form-help-text" style={{ marginTop: "0.5rem" }}>
              Before you can deploy a machine you must import at least one
              public SSH key into MAAS, so the deployed machine can be accessed.
            </p>
          </Col>
        </Row>
        <Link
          external
          href="https://maas.io/docs/user-accounts#heading--ssh-keys"
        >
          About SSH keys
        </Link>
        <FormCardButtons
          actionDisabled={saving || formikFormDisabled(formikProps)}
          actionLabel="Import SSH key"
          actionLoading={saving}
          actionSuccess={saved}
        />
      </Form>
    </>
  );
};

SSHKeyFormFields.propTypes = {
  editing: PropTypes.bool,
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      auth_id: PropTypes.string,
      key: PropTypes.string,
      protocol: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.shape({
      auth_id: PropTypes.bool,
      key: PropTypes.bool,
      protocol: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      auth_id: PropTypes.string,
      key: PropTypes.string,
      protocol: PropTypes.string
    }).isRequired
  })
};

export default SSHKeyFormFields;
