import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterHosts = ({ clusterId }: Props): JSX.Element => {
  return <h4>LXD cluster {clusterId} VM hosts</h4>;
};

export default LXDClusterHosts;
