import { useState } from "react";

import { useOnEscapePressed } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useAddMessage } from "@/app/base/hooks";
import urls from "@/app/preferences/urls";
import { sshkeyActions } from "@/app/store/sshkey";
import sshkeySelectors from "@/app/store/sshkey/selectors";
import type { SSHKey, SSHKeyMeta } from "@/app/store/sshkey/types";

const DeleteSSHKey = () => {
  const [deleting, setDeleting] = useState<SSHKey[SSHKeyMeta.PK][]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const saved = useSelector(sshkeySelectors.saved);
  const saving = useSelector(sshkeySelectors.saving);
  const sshkeys = useSelector(sshkeySelectors.all);
  const dispatch = useDispatch();
  const onClose = () => navigate({ pathname: urls.sshKeys.index });
  useOnEscapePressed(() => onClose());
  const sshKeysDeleted =
    deleting.length > 0 &&
    !deleting.some((id) => !sshkeys.find((key) => key.id === id));
  useAddMessage(
    saved && sshKeysDeleted,
    sshkeyActions.cleanup,
    "SSH key removed successfully.",
    () => setDeleting([])
  );

  const ids = searchParams
    .get("ids")
    ?.split(",")
    .map((id) => Number(id));

  if (!ids || ids?.length === 0) {
    return <h4>SSH key not found</h4>;
  }

  return (
    <ModelActionForm
      aria-label="Delete SSH key confirmation"
      initialValues={{}}
      message={`Are you sure you want to delete ${
        ids.length > 1 ? "these SSH keys" : "this SSH key"
      }?`}
      modelType="SSH key"
      onCancel={onClose}
      onSubmit={() => {
        ids.forEach((id) => {
          dispatch(sshkeyActions.delete(id));
        });
        setDeleting(ids);
      }}
      onSuccess={() => {
        dispatch(sshkeyActions.cleanup());
        onClose();
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteSSHKey;
