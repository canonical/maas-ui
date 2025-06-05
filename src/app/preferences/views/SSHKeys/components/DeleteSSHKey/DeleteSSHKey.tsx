import type { ReactElement } from "react";

import { useDeleteSshKey } from "@/app/api/query/sshKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteSSHKeyProps = {
  readonly ids: number[];
  readonly closeForm: () => void;
};

const DeleteSSHKey = ({ ids, closeForm }: DeleteSSHKeyProps): ReactElement => {
  const deleteSshKey = useDeleteSshKey();

  return (
    <ModelActionForm
      aria-label="Confirm SSH key deletion"
      errors={deleteSshKey.error}
      initialValues={{}}
      message={`Are you sure you want to delete ${
        ids.length > 1 ? "these SSH keys" : "this SSH key"
      }?`}
      modelType="SSH key"
      onCancel={closeForm}
      onSubmit={() => {
        ids.forEach((id) => {
          deleteSshKey.mutate({ path: { id } });
        });
      }}
      onSuccess={closeForm}
      saved={deleteSshKey.isSuccess}
      saving={deleteSshKey.isPending}
    />
  );
};

export default DeleteSSHKey;
