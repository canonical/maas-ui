import type { ReactElement } from "react";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

const DeleteAllNotifications = (): ReactElement => {
  const { closeModal } = useModal();

  return (
    <ModelActionForm
      aria-label="Confirm deletion of all notifications"
      initialValues={{}}
      message="Are you sure you want to delete all notifications? This action is permanent and cannot be undone."
      modelType="notification"
      onCancel={closeModal}
      onSubmit={() => {
        // TODO: wire this up once the backend's bulk-delete endpoint for
        // notifications exists
      }}
      // Submit is intentionally disabled until the above is wired up — see
      // the TODO in onSubmit. Remove this once a real bulk-delete mutation
      // is in place.
      submitDisabled
      submitLabel="Delete all"
    />
  );
};

export default DeleteAllNotifications;
