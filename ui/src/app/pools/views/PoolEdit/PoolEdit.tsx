import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import PoolForm from "../PoolForm";

import type { RouteParams } from "app/base/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";

export const PoolEdit = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const loaded = useSelector(poolSelectors.loaded);
  const loading = useSelector(poolSelectors.loading);
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, parseInt(id))
  );

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (loaded && !pool) {
    return <h4>Resource pool not found</h4>;
  }
  return <PoolForm pool={pool} />;
};

export default PoolEdit;
