import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterSettings = ({ clusterId }: Props): JSX.Element => {
  return <h4>LXD cluster {clusterId} settings</h4>;
};

export default LXDClusterSettings;
