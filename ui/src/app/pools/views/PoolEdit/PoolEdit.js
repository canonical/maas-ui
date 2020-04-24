import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";

import { resourcepool as poolSelectors } from "app/base/selectors";
import { useParams } from "app/base/hooks";
import PoolForm from "../PoolForm";

export const PoolEdit = () => {
  const { id } = useParams();
  const loaded = useSelector(poolSelectors.loaded);
  const loading = useSelector(poolSelectors.loading);
  const pool = useSelector((state) =>
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
