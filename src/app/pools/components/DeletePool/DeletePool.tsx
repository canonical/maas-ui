import type { ReactElement } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDeletePool } from "@/app/api/query/pools";
import { getResourcePoolQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeletePoolProps = {
  id: number;
  closeForm: () => void;
};

const DeletePool = ({ id, closeForm }: DeletePoolProps): ReactElement => {
  const queryClient = useQueryClient();
  const deletePool = useDeletePool();

  return (
    <ModelActionForm
      aria-label="Confirm pool deletion"
      errors={deletePool.error}
      initialValues={{}}
      modelType="resource pool"
      onCancel={closeForm}
      onSubmit={() => {
        deletePool.mutate({ path: { resource_pool_id: id } });
      }}
      onSuccess={() => {
        queryClient
          .invalidateQueries({
            queryKey: getResourcePoolQueryKey({
              path: { resource_pool_id: id },
            }),
          })
          .then(closeForm);
      }}
      saved={deletePool.isSuccess}
      saving={deletePool.isPending}
    />
  );
};

export default DeletePool;
