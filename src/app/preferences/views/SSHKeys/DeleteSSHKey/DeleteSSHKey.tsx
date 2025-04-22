import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate, useSearchParams } from "react-router";

import { useDeleteSshKey } from "@/app/api/query/sshKeys";
import type { DeleteUserSshkeyError } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import type { EmptyObject } from "@/app/base/types";
import urls from "@/app/preferences/urls";

const DeleteSSHKey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const onClose = () => navigate({ pathname: urls.sshKeys.index });
  useOnEscapePressed(() => onClose());

  const deleteSshKey = useDeleteSshKey();

  const ids = searchParams
    .get("ids")
    ?.split(",")
    .map((id) => Number(id));

  if (!ids || ids?.length === 0) {
    return <h4>SSH key not found</h4>;
  }

  return (
    <ModelActionForm<EmptyObject, DeleteUserSshkeyError>
      aria-label="Delete SSH key confirmation"
      errors={deleteSshKey.error}
      initialValues={{}}
      message={`Are you sure you want to delete ${
        ids.length > 1 ? "these SSH keys" : "this SSH key"
      }?`}
      modelType="SSH key"
      onCancel={onClose}
      onSubmit={() => {
        ids.forEach((id) => {
          deleteSshKey.mutate({ path: { id } });
        });
      }}
      onSuccess={onClose}
      saved={deleteSshKey.isSuccess}
      saving={deleteSshKey.isPending}
    />
  );
};

export default DeleteSSHKey;
