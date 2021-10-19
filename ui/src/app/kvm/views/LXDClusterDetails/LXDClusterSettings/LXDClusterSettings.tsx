import Strip from "@canonical/react-components/dist/components/Strip";

import SettingsBackLink from "app/kvm/components/SettingsBackLink";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterSettings = ({ clusterId }: Props): JSX.Element => {
  return (
    <Strip className="u-no-padding--top" shallow>
      <SettingsBackLink returnToList="lxd" />
      <h4>LXD cluster {clusterId} settings</h4>
    </Strip>
  );
};

export default LXDClusterSettings;
