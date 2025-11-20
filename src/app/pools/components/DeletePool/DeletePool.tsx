import type { ReactElement } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useDeletePool, useGetPool } from "@/app/api/query/pools";
import { getResourcePoolQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeletePoolProps = {
  id: number;
};

const DeletePool = ({ id }: DeletePoolProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const pool = useGetPool({ path: { resource_pool_id: id } });

  const eTag = pool.data?.headers?.get("ETag");
  const deletePool = useDeletePool();

  return (
    <>
      {pool.isPending && <Spinner text="Loading..." />}
      {pool.isError && (
        <Notification data-testid="no-such-pool-error" severity="negative">
          {pool.error.message}
        </Notification>
      )}
      {pool.isSuccess && pool.data && (
        <ModelActionForm
          aria-label="Confirm pool deletion"
          errors={deletePool.error}
          initialValues={{}}
          modelType="resource pool"
          onCancel={closeSidePanel}
          onSubmit={() => {
            deletePool.mutate({
              headers: { ETag: eTag },
              path: { resource_pool_id: id },
            });
          }}
          onSuccess={() => {
            return queryClient
              .invalidateQueries({
                queryKey: getResourcePoolQueryKey({
                  path: { resource_pool_id: id },
                }),
              })
              .then(closeSidePanel);
          }}
          saved={deletePool.isSuccess}
          saving={deletePool.isPending}
        />
      )}
    </>
  );
};

export default DeletePool;
