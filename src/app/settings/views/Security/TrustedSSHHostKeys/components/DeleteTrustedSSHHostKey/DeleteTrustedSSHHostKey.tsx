import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";

import { useDeleteTrustedSshHostKey } from "@/app/api/query/trustedSshHostKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteTrustedSSHHostKeyProps = {
  id: number;
};

const DeleteTrustedSSHHostKey = ({
  id,
}: DeleteTrustedSSHHostKeyProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const deleteTrustedSshHostKey = useDeleteTrustedSshHostKey();

  return (
    <ModelActionForm
      aria-label="Confirm SSH host key deletion"
      errors={deleteTrustedSshHostKey.error}
      initialValues={{}}
      message="Are you sure you want to delete this SSH host key?"
      modelType="SSH host key"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteTrustedSshHostKey.mutate({ path: { ssh_host_key_id: id } });
      }}
      onSuccess={closeSidePanel}
      saved={deleteTrustedSshHostKey.isSuccess}
      saving={deleteTrustedSshHostKey.isPending}
    />
  );
};

export default DeleteTrustedSSHHostKey;
