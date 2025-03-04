import { useSelector } from "react-redux";

import { useGetZone } from "@/app/api/query/zones";
import type { ZoneResponse } from "@/app/apiclient";
import DoubleRow from "@/app/base/components/DoubleRow";
import poolSelectors from "@/app/store/resourcepool/selectors";
import type {
  ResourcePool,
  ResourcePoolMeta,
} from "@/app/store/resourcepool/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  poolId?: ResourcePool[ResourcePoolMeta.PK] | null;
  zoneId?: ZoneResponse["id"] | null;
};

const PoolColumn = ({ poolId, zoneId }: Props): JSX.Element | null => {
  const pool = useSelector((state: RootState) =>
    poolSelectors.getById(state, poolId)
  );
  const { data: zone } = useGetZone({ path: { zone_id: zoneId! } });

  return (
    <DoubleRow
      primary={<span data-testid="zone">{zone?.name}</span>}
      secondary={<span data-testid="pool">{pool?.name}</span>}
    />
  );
};

export default PoolColumn;
