import type { ReactElement } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import { useDeleteRack, useGetRack } from "@/app/api/query/racks";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeleteRackProps = {
  id: number;
};
const DeleteRack = ({ id }: DeleteRackProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const rack = useGetRack({ path: { rack_id: id } });
  const eTag = rack.data?.headers?.get("ETag");
  const deleteRack = useDeleteRack();

  return (
    <>
      {rack.isPending && <Spinner text="Loading..." />}
      {rack.isError && (
        <Notification data-testid="no-such-rack-error" severity="negative">
          {rack.error.message}
        </Notification>
      )}
      {rack.isSuccess && rack.data && (
        <ModelActionForm
          aria-label="Confirm rack deletion"
          errors={deleteRack.error}
          initialValues={{}}
          modelType="rack"
          onCancel={closeSidePanel}
          onSubmit={() => {
            deleteRack.mutate({
              headers: { ETag: eTag },
              path: { rack_id: id },
            });
          }}
          onSuccess={() => {
            closeSidePanel();
          }}
          saved={deleteRack.isSuccess}
          saving={deleteRack.isPending}
        />
      )}
    </>
  );
};

export default DeleteRack;
