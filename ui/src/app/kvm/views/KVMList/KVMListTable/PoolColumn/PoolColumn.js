import React from "react";
import { useSelector } from "react-redux";

import {
  pod as podSelectors,
  resourcepool as poolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PoolColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));
  const pool = useSelector((state) =>
    poolSelectors.getById(state, pod && pod.pool)
  );
  const zone = useSelector((state) =>
    zoneSelectors.getById(state, pod && pod.zone)
  );

  return (
    <DoubleRow
      primary={<span data-test="pod-pool">{pool && pool.name}</span>}
      secondary={<span data-test="pod-zone">{zone && zone.name}</span>}
    />
  );
};

export default PoolColumn;
