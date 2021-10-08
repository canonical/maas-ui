import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterVMs = ({ clusterId }: Props): JSX.Element => {
  return <h4>LXD cluster {clusterId} virtual machines</h4>;
};

export default LXDClusterVMs;
