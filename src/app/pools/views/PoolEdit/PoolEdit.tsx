import { Spinner, useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import { useGetPool } from "@/app/api/query/pools";
import ModelNotFound from "@/app/base/components/ModelNotFound";
import { useGetURLId } from "@/app/base/hooks/urls";
import urls from "@/app/base/urls";
import PoolForm from "@/app/pools/components/PoolForm";
import poolURLs from "@/app/pools/urls";

export enum Label {
  Title = "Edit pool form",
}

export const PoolEdit = (): React.ReactElement => {
  const id = useGetURLId("id");
  const navigate = useNavigate();
  const onCancel = () => navigate({ pathname: urls.pools.index });
  useOnEscapePressed(() => onCancel());
  const pool = useGetPool({ path: { resource_pool_id: id! } });

  if (pool.isPending) {
    return <Spinner text="Loading..." />;
  }
  if (pool.isError) {
    return (
      <ModelNotFound
        id={id}
        linkURL={poolURLs.index}
        modelName="resource pool"
      />
    );
  }
  return (
    <PoolForm aria-label={Label.Title} onClose={onCancel} pool={pool.data} />
  );
};

export default PoolEdit;
