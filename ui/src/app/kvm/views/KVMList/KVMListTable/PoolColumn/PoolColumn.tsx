import React from "react";
import { useSelector } from "react-redux";

import {
  pod as podSelectors,
  resourcepool as poolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import { RootState } from "app/store/root/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const PoolColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, pod && pod.pool)
  );
  const zone = useSelector((state: RootState) =>
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
