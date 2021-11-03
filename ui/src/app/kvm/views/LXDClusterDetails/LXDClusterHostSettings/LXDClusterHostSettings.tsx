import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { useWindowTitle } from "app/base/hooks";
import KVMConfigurationCard from "app/kvm/components/KVMConfigurationCard";
import LXDHostToolbar from "app/kvm/components/LXDHostToolbar";
import SettingsBackLink from "app/kvm/components/SettingsBackLink";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { isPodDetails } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  hostId: Pod["id"];
};

const LXDClusterHostSettings = ({ clusterId, hostId }: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const loading = useSelector(podSelectors.loading);
  useActivePod(hostId);
  const redirectURL = useKVMDetailsRedirect(hostId);
  useWindowTitle(
    `${pod?.name || "Host"} in ${cluster?.name || "cluster"} settings`
  );

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
  if (loading || !isPodDetails(pod)) {
    return <Spinner text="Loading..." />;
  }
  return (
    <Strip className="u-no-padding--top" shallow>
      <SettingsBackLink />
      <LXDHostToolbar clusterId={clusterId} hostId={hostId} showBasic />
      <KVMConfigurationCard pod={pod} zoneDisabled />
    </Strip>
  );
};

export default LXDClusterHostSettings;
