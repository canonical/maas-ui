import type { ReactElement } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDeletePool } from "@/app/api/query/pools";
import { getResourcePoolQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeletePoolProps = {
  id: number;
};

const DeletePool = ({ id }: DeletePoolProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const deletePool = useDeletePool();

  return (
    <ModelActionForm
      aria-label="Confirm pool deletion"
      errors={deletePool.error}
      initialValues={{}}
      modelType="resource pool"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deletePool.mutate({ path: { resource_pool_id: id } });
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
  );
};

export default DeletePool;
