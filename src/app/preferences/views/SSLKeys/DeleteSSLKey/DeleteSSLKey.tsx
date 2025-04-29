import type { ReactElement } from "react";

import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router";

import { useDeleteSslKey } from "@/app/api/query/sslKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useGetURLId } from "@/app/base/hooks";
import urls from "@/app/preferences/urls";
import { Label } from "@/app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import { isId } from "@/app/utils";

const DeleteSSLKey = (): ReactElement => {
  const id = useGetURLId("id");
  const navigate = useNavigate();
  const deleteSSLKey = useDeleteSslKey();
  const saved = deleteSSLKey.isSuccess;
  const saving = deleteSSLKey.isPending;
  const onClose = () => navigate({ pathname: urls.sslKeys.index });
  useOnEscapePressed(() => onClose());

  if (!isId(id)) {
    return <h4>SSL key not found</h4>;
  }

  return (
    <ModelActionForm
      aria-label={Label.DeleteConfirm}
      initialValues={{}}
      modelType="SSL key"
      onCancel={onClose}
      onSubmit={() => deleteSSLKey.mutate({ path: { sslkey_id: id } })}
      saved={saved}
      savedRedirect={urls.sslKeys.index}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    />
  );
};

export default DeleteSSLKey;
