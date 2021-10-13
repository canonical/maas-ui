import type { Pod } from "app/store/pod/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  hostId: Pod["id"];
};

const LXDClusterHostSettings = ({ clusterId, hostId }: Props): JSX.Element => {
  return (
    <h4>
      Host {hostId} in cluster {clusterId} settings
    </h4>
  );
};

export default LXDClusterHostSettings;
