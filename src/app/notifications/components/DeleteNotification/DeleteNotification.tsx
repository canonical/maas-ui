import type { ReactElement } from "react";

import { useDeleteNotification } from "@/app/api/query/notifications";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type Props = {
  id: number;
};

const DeleteNotification = ({ id }: Props): ReactElement => {
  const { closeModal } = useModal();
  const deleteNotification = useDeleteNotification();

  return (
    <ModelActionForm
      aria-label={`Confirm deletion of notification ${id}`}
      errors={deleteNotification.error}
      initialValues={{}}
      modelType="notification"
      onCancel={closeModal}
      onSubmit={() => {
        deleteNotification.mutate({ path: { notification_id: id } });
      }}
      onSuccess={() => {
        closeModal();
      }}
      saved={deleteNotification.isSuccess}
      saving={deleteNotification.isPending}
    />
  );
};

export default DeleteNotification;
