import React from "react";
import { useSelector } from "react-redux";

import {
  pod as podSelectors,
  resourcepool as poolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";

const PoolColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));
  const pool = useSelector((state) =>
    poolSelectors.getById(state, pod && pod.pool)
  );
  const zone = useSelector((state) =>
    zoneSelectors.getById(state, pod && pod.zone)
  );

  return (
    <>
      <span data-test="pod-pool">{pool && pool.name}</span>
      <br />
      <small className="u-text--light" data-test="pod-zone">
        {zone && zone.name}
      </small>
    </>
  );
};

export default PoolColumn;
