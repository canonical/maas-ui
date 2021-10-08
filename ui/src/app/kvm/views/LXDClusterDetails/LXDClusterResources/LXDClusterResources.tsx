import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterResources = ({ clusterId }: Props): JSX.Element => {
  return <h4>LXD cluster {clusterId} resources</h4>;
};

export default LXDClusterResources;
