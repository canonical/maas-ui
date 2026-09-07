import type { ReactElement } from "react";

import { useDeleteTrustedSshHostKey } from "@/app/api/query/trustedSshHostKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteTrustedSSHHostKeyProps = {
  id: number;
  closeForm: () => void;
};

const DeleteTrustedSSHHostKey = ({
  id,
  closeForm,
}: DeleteTrustedSSHHostKeyProps): ReactElement => {
  const deleteTrustedSshHostKey = useDeleteTrustedSshHostKey();

  return (
    <ModelActionForm
      aria-label="Confirm SSH host key deletion"
      errors={deleteTrustedSshHostKey.error}
      initialValues={{}}
      message="Are you sure you want to delete this SSH host key?"
      modelType="SSH host key"
      onCancel={closeForm}
      onSubmit={() => {
        deleteTrustedSshHostKey.mutate({ path: { ssh_host_key_id: id } });
      }}
      onSuccess={closeForm}
      saved={deleteTrustedSshHostKey.isSuccess}
      saving={deleteTrustedSshHostKey.isPending}
    />
  );
};

export default DeleteTrustedSSHHostKey;
