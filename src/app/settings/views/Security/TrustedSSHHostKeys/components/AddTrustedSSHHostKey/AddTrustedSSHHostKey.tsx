import type { ReactElement } from "react";

import { Col, Row, Select, Textarea } from "@canonical/react-components";
import * as Yup from "yup";

import { useCreateTrustedSshHostKey } from "@/app/api/query/trustedSshHostKeys";
import type { CreateSshHostKeyError, SshHostKeyRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type AddTrustedSSHHostKeyProps = {
  closeForm: () => void;
};

// Standard SSH public-key types accepted by MAAS.
const KEY_TYPE_OPTIONS = [
  { value: "", label: "Select key type" },
  { value: "ssh-rsa", label: "ssh-rsa" },
  { value: "ecdsa-sha2-nistp256", label: "ecdsa-sha2-nistp256" },
  { value: "ecdsa-sha2-nistp384", label: "ecdsa-sha2-nistp384" },
  { value: "ecdsa-sha2-nistp521", label: "ecdsa-sha2-nistp521" },
  { value: "ssh-ed25519", label: "ssh-ed25519" },
  {
    value: "sk-ecdsa-sha2-nistp256@openssh.com",
    label: "sk-ecdsa-sha2-nistp256@openssh.com",
  },
  {
    value: "sk-ssh-ed25519@openssh.com",
    label: "sk-ssh-ed25519@openssh.com",
  },
];

const TrustedSSHHostKeySchema = Yup.object().shape({
  host: Yup.string()
    .required("Host is required")
    .max(255, "Host must be 255 characters or less"),
  key_type: Yup.string().required("Key type is required"),
  public_key: Yup.string().required("Public key is required"),
  label: Yup.string().max(255, "Label must be 255 characters or less"),
});

export const AddTrustedSSHHostKey = ({
  closeForm,
}: AddTrustedSSHHostKeyProps): ReactElement => {
  const createTrustedSshHostKey = useCreateTrustedSshHostKey();

  return (
    <FormikForm<SshHostKeyRequest, CreateSshHostKeyError>
      aria-label="Add SSH host key"
      errors={createTrustedSshHostKey.error}
      initialValues={{ host: "", key_type: "", public_key: "", label: "" }}
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Saved",
        category: "Trusted SSH host keys settings",
        label: "Add SSH host key form",
      }}
      onSubmit={(values) => {
        createTrustedSshHostKey.mutate({
          body: {
            host: values.host,
            key_type: values.key_type,
            public_key: values.public_key,
            label: values.label ? values.label : undefined,
          },
        });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={createTrustedSshHostKey.isSuccess}
      saving={createTrustedSshHostKey.isPending}
      submitLabel="Add SSH key"
      validationSchema={TrustedSSHHostKeySchema}
    >
      <Row>
        <Col size={12}>
          <FormikField
            label="Host"
            name="host"
            placeholder="e.g. 192.168.1.1"
            required
            type="text"
          />
          <FormikField
            component={Select}
            label="Key type"
            name="key_type"
            options={KEY_TYPE_OPTIONS}
            required
          />
          <FormikField
            component={Textarea}
            label="Public key"
            name="public_key"
            required
            style={{ minHeight: "6rem" }}
          />
          <FormikField label="Label" name="label" type="text" />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddTrustedSSHHostKey;
