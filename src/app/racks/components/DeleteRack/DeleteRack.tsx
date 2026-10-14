import type { ReactElement } from "react";

import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";

import { useDeleteRack, useGetRack } from "@/app/api/query/racks";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type DeleteRackProps = {
  id: number;
};
const DeleteRack = ({ id }: DeleteRackProps): ReactElement => {
  const { closeModal } = useModal();
  const rack = useGetRack({ path: { rack_id: id } });
  const eTag = rack.data?.headers?.get("ETag");
  const deleteRack = useDeleteRack();

  return (
    <>
      {rack.isPending && <Spinner text="Loading..." />}
      {rack.isError && (
        <NotificationBanner severity="negative">
          {rack.error.message}
        </NotificationBanner>
      )}
      {rack.isSuccess && rack.data && (
        <ModelActionForm
          aria-label="Confirm rack deletion"
          errors={deleteRack.error}
          initialValues={{}}
          modelType="rack"
          onCancel={closeModal}
          onSubmit={() => {
            deleteRack.mutate({
              headers: { ETag: eTag },
              path: { rack_id: id },
            });
          }}
          onSuccess={() => {
            closeModal();
          }}
          saved={deleteRack.isSuccess}
          saving={deleteRack.isPending}
        />
      )}
    </>
  );
};

export default DeleteRack;
