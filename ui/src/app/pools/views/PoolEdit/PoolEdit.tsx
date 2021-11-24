import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import PoolForm from "../PoolForm";

import ModelNotFound from "app/base/components/ModelNotFound";
import type { RouteParams } from "app/base/types";
import poolURLs from "app/pools/urls";
import poolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";

export const PoolEdit = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const loading = useSelector(poolSelectors.loading);
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, parseInt(id))
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
