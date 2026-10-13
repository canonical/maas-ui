import type { ReactElement } from "react";

import { useDeleteSslKey } from "@/app/api/query/sslKeys";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type DeleteSSLKeyProps = {
  id: number;
};

const DeleteSSLKey = ({ id }: DeleteSSLKeyProps): ReactElement => {
  const { closeModal } = useModal();
  const deleteSSLKey = useDeleteSslKey();

  return (
    <ModelActionForm
      aria-label="Confirm SSL key deletion"
      errors={deleteSSLKey.error}
      initialValues={{}}
      message="Are you sure you want to delete this SSL key?"
      modelType="SSL key"
      onCancel={closeModal}
      onSubmit={() => {
        deleteSSLKey.mutate({ path: { sslkey_id: id } });
      }}
      onSuccess={closeModal}
      saved={deleteSSLKey.isSuccess}
      saving={deleteSSLKey.isPending}
    />
  );
};

export default DeleteSSLKey;
