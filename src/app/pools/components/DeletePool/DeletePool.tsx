import type { ReactElement } from "react";

import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useDeletePool, useGetPool } from "@/app/api/query/pools";
import { listResourcePoolsStatisticsQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type DeletePoolProps = {
  id: number;
};

const DeletePool = ({ id }: DeletePoolProps): ReactElement => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const pool = useGetPool({ path: { resource_pool_id: id } });

  const eTag = pool.data?.headers?.get("ETag");
  const deletePool = useDeletePool();

  return (
    <>
      {pool.isPending && <Spinner text="Loading..." />}
      {pool.isError && (
        <NotificationBanner severity="negative">
          {pool.error.message}
        </NotificationBanner>
      )}
      {pool.isSuccess && pool.data && (
        <ModelActionForm
          aria-label="Confirm pool deletion"
          errors={deletePool.error}
          initialValues={{}}
          modelType="resource pool"
          onCancel={closeModal}
          onSubmit={() => {
            deletePool.mutate({
              headers: { ETag: eTag },
              path: { resource_pool_id: id },
            });
          }}
          onSuccess={() => {
            return queryClient
              .invalidateQueries({
                queryKey: listResourcePoolsStatisticsQueryKey(),
              })
              .then(closeModal);
          }}
          saved={deletePool.isSuccess}
          saving={deletePool.isPending}
        />
      )}
    </>
  );
};

export default DeletePool;
