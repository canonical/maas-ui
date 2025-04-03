import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router";

import { useDeletePool } from "@/app/api/query/pools";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import urls from "@/app/base/urls";

const PoolDeleteForm = ({ id }: { id: number }) => {
  const deletePool = useDeletePool();
  const navigate = useNavigate();
  const onClose = () => {
    navigate({ pathname: urls.pools.index });
  };
  useOnEscapePressed(() => {
    onClose();
  });

  return (
    <ModelActionForm
      aria-label="Confirm pool deletion"
      errors={deletePool.error}
      initialValues={{}}
      modelType="resource pool"
      onCancel={onClose}
      onSubmit={() => {
        deletePool.mutate({ path: { resource_pool_id: id } });
      }}
      saved={deletePool.isSuccess}
      savedRedirect={urls.pools.index}
      saving={deletePool.isPending}
    />
  );
};

export default PoolDeleteForm;
