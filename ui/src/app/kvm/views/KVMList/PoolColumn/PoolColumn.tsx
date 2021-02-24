import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import podSelectors from "app/store/pod/selectors";
import poolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import zoneSelectors from "app/store/zone/selectors";

type Props = { id: number };

const PoolColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, pod && pod.pool)
  );
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, pod && pod.zone)
  );

  if (pod) {
    return (
      <DoubleRow
        primary={<span data-test="pod-pool">{pool?.name}</span>}
        secondary={<span data-test="pod-zone">{zone?.name}</span>}
      />
    );
  }
  return null;
};

export default PoolColumn;
