import { ExternalLink } from "@canonical/maas-react-components";
import { Col, Row, Select, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FormikField from "@/app/base/components/FormikField";
import TooltipButton from "@/app/base/components/TooltipButton";
import docsUrls from "@/app/base/docsUrls";
import type { SSHKeyFormValues } from "@/app/preferences/views/SSHKeys/components/AddSSHKey/AddSSHKey";

export const Labels = {
  Source: "SSH key source",
  SourceHelp:
    "Choose where to import your SSH key from: Launchpad, GitHub, or upload a key manually.",
  LaunchpadID: "Launchpad ID",
  LaunchpadIDHelp: "Your Launchpad username (launchpad.net/~username)",
  GitHubUsername: "GitHub username",
  GitHubUsernameHelp: "Your GitHub username (github.com/username)",
} as const;

export const SSHKeyFormFields = (): React.ReactElement => {
  const { values } = useFormikContext<SSHKeyFormValues>();
  const { protocol } = values;
  const uploadSelected = protocol === "upload";

  return (
    <>
      <Row>
        <Col size={12}>
          <FormikField
            component={Select}
            help={Labels.SourceHelp}
            label={Labels.Source}
            name="protocol"
            options={[
              { value: "", label: "Select source" },
              { value: "lp", label: "Launchpad" },
              { value: "gh", label: "GitHub" },
              { value: "upload", label: "Upload" },
            ]}
          />
          {protocol && !uploadSelected && (
            <FormikField
              help={
                protocol === "lp"
                  ? Labels.LaunchpadIDHelp
                  : Labels.GitHubUsernameHelp
              }
              label={
                protocol === "lp" ? Labels.LaunchpadID : Labels.GitHubUsername
              }
              name="auth_id"
              required={true}
              type="text"
            />
          )}
          {uploadSelected && (
            <FormikField
              aria-label="Public key"
              component={Textarea}
              help="Usually at ~/.ssh/id_rsa.pub, ~/.ssh/id_dsa.pub, or ~/.ssh/id_ecdsa.pub"
              label={
                <>
                  Public key{" "}
                  <TooltipButton
                    iconName="help"
                    message={`Begins with 'ssh-rsa', 'ssh-ed25519',
                  'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or
                  'ecdsa-sha2-nistp521`}
                    position="btm-left"
                  />
                </>
              }
              name="key"
              style={{ minHeight: "10rem" }}
            />
          )}
        </Col>
        <Col size={12}>
          <p className="form-card__help">
            Before you can deploy a machine you must import at least one public
            SSH key into MAAS, so the deployed machine can be accessed.
          </p>
        </Col>
      </Row>
      <ExternalLink to={docsUrls.sshKeys}>About SSH keys</ExternalLink>
    </>
  );
};

export default SSHKeyFormFields;
