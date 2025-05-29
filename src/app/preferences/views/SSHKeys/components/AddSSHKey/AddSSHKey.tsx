import type { ReactElement } from "react";

import * as Yup from "yup";

import { useCreateSshKeys, useImportSshKeys } from "@/app/api/query/sshKeys";
import type {
  CreateUserSshkeysError,
  ImportUserSshkeysError,
  SshKeyImportFromSourceRequest,
  SshKeyManualUploadRequest,
  SshKeysProtocolType,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import SSHKeyFormFields from "@/app/preferences/views/SSHKeys/components/AddSSHKey/SSHKeyFormFields";

type AddSSHKeyProps = {
  closeForm?: () => void;
};

export type SSHKeyFormValues = {
  protocol: SshKeyImportFromSourceRequest["protocol"] | "" | "upload";
  auth_id: SshKeyImportFromSourceRequest["auth_id"];
  key: SshKeyManualUploadRequest["key"];
};

const SSHKeySchema = Yup.object().shape({
  protocol: Yup.string().required("Source is required"),
  auth_id: Yup.string().when("protocol", {
    is: (val: string) => val && val !== "upload",
    then: Yup.string().required("ID is required"),
  }),
  key: Yup.string().when("protocol", {
    is: (val: string) => val === "upload",
    then: Yup.string().required("Key is required"),
  }),
});

const AddSSHKey = ({ closeForm }: AddSSHKeyProps): ReactElement => {
  const uploadSshKey = useCreateSshKeys();
  const importSshKey = useImportSshKeys();

  return (
    <FormikForm<
      SSHKeyFormValues,
      CreateUserSshkeysError | ImportUserSshkeysError
    >
      aria-label="Add SSH key"
      errors={uploadSshKey.error || importSshKey.error}
      initialValues={{ auth_id: "", protocol: "", key: "" }}
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Saved",
        category: "SSH keys preferences",
        label: "Import SSH key form",
      }}
      onSubmit={(values) => {
        if (values.key && values.key !== "") {
          uploadSshKey.mutate({
            body: {
              key: values.key,
            },
          });
        } else {
          importSshKey.mutate({
            body: {
              auth_id: values.auth_id as string,
              protocol: values.protocol as SshKeysProtocolType,
            },
          });
        }
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={uploadSshKey.isSuccess || importSshKey.isSuccess}
      saving={uploadSshKey.isPending || importSshKey.isPending}
      submitLabel="Import SSH key"
      validationSchema={SSHKeySchema}
    >
      <SSHKeyFormFields />
    </FormikForm>
  );
};

export default AddSSHKey;
