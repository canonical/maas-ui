import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelNotFound from "app/base/components/ModelNotFound";
import { useGetURLId } from "app/base/hooks/urls";
import PoolForm from "app/pools/components/PoolForm";
import poolURLs from "app/pools/urls";
import poolSelectors from "app/store/resourcepool/selectors";
import { ResourcePoolMeta } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";

export enum Label {
  Title = "Edit pool form",
}

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
        linkURL={poolURLs.index}
        modelName="resource pool"
      />
    );
  }
  return <PoolForm aria-label={Label.Title} pool={pool} />;
};

export default PoolEdit;
