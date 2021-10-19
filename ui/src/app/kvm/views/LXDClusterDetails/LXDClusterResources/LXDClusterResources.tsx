import { Strip } from "@canonical/react-components";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterResources = ({ clusterId }: Props): JSX.Element => {
  return (
    <Strip shallow>
      <LXDClusterSummaryCard clusterId={clusterId} showStorage={false} />
      {/* TODO: Add generic storage cards section */}
    </Strip>
  );
};

export default LXDClusterResources;
