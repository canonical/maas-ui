import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import PoolForm from "../PoolForm";

import ModelNotFound from "app/base/components/ModelNotFound";
import { useGetURLId } from "app/base/hooks/urls";
import poolURLs from "app/pools/urls";
import poolSelectors from "app/store/resourcepool/selectors";
import { ResourcePoolMeta } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";

export const PoolEdit = (): JSX.Element => {
  const id = useGetURLId(ResourcePoolMeta.PK);
  const loading = useSelector(poolSelectors.loading);
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, id)
  );

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!loading && !pool) {
    return (
      <ModelNotFound
        id={id}
        linkURL={poolURLs.pools}
        modelName="resource pool"
      />
    );
  }
  return <PoolForm pool={pool} />;
};

export default PoolEdit;
