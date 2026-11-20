import type { ReactElement } from "react";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type Props = {
  id: number;
};

const DeleteNotification = ({ id }: Props): ReactElement => {
  const { closeModal } = useModal();

  return (
    <ModelActionForm
      aria-label={`Confirm deletion of notification ${id}`}
      initialValues={{}}
      modelType="notification"
      onCancel={closeModal}
      onSubmit={() => {
        // TODO: wire this up to `deleteNotification` once a user-facing
        // delete endpoint is available. The generated mutation already
        // exists (`deleteNotificationMutation` in
        // src/app/apiclient/@tanstack/react-query.gen.ts), but calling
        // DELETE /notifications/{id} today requires the
        // `CAN_EDIT_NOTIFICATIONS` entitlement, which most users won't
        // have by default — confirm the intended access model before
        // wiring this.
      }}
      // Submit is intentionally disabled until the above is wired up — see
      // the TODO in onSubmit. Remove this once a real delete mutation is
      // in place.
      submitDisabled
    />
  );
};

export default DeleteNotification;
