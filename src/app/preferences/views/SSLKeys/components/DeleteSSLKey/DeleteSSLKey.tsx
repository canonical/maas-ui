import type { ReactElement } from "react";

import { useDeleteSslKey } from "@/app/api/query/sslKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteSSLKeyProps = {
  id: number;
  closeForm: () => void;
};

const DeleteSSLKey = ({ id, closeForm }: DeleteSSLKeyProps): ReactElement => {
  const deleteSSLKey = useDeleteSslKey();

  return (
    <ModelActionForm
      aria-label="Confirm SSL key deletion"
      errors={deleteSSLKey.error}
      initialValues={{}}
      message="Are you sure you want to delete this SSL key?"
      modelType="SSL key"
      onCancel={closeForm}
      onSubmit={() => deleteSSLKey.mutate({ path: { sslkey_id: id } })}
      onSuccess={closeForm}
      saved={deleteSSLKey.isSuccess}
      saving={deleteSSLKey.isPending}
    />
  );
};

export default DeleteSSLKey;
