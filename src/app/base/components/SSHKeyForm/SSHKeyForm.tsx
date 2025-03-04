import * as Yup from "yup";

import SSHKeyFormFields from "./SSHKeyFormFields";
import type { SSHKeyFormValues } from "./types";

import { useCreateSshKeys, useImportSshKeys } from "@/app/api/query/sshKeys";
import type {
  CreateUserSshkeysError,
  ImportUserSshkeysError,
  SshKeysProtocolType,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import type { Props as FormikFormProps } from "@/app/base/components/FormikForm/FormikForm";

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

type Props = {
  cols?: number;
} & Partial<FormikFormProps<SSHKeyFormValues>>;

export const SSHKeyForm = ({ cols, ...props }: Props): JSX.Element => {
  const uploadSshKey = useCreateSshKeys();
  const importSshKey = useImportSshKeys();

  return (
    <FormikForm<
      SSHKeyFormValues,
      ImportUserSshkeysError | CreateUserSshkeysError
    >
      errors={uploadSshKey.error || importSshKey.error}
      initialValues={{ auth_id: "", protocol: "", key: "" }}
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
      saved={uploadSshKey.isSuccess || importSshKey.isSuccess}
      saving={uploadSshKey.isPending || importSshKey.isPending}
      submitLabel="Import SSH key"
      validationSchema={SSHKeySchema}
      {...props}
    >
      <SSHKeyFormFields />
    </FormikForm>
  );
};

export default SSHKeyForm;
