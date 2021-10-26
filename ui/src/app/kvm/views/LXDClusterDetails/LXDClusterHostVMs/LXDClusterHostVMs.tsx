import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import LXDHostVMs from "app/kvm/components/LXDHostVMs";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  hostId: Pod["id"];
  searchFilter: string;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const LXDClusterHostVMs = ({
  clusterId,
  hostId,
  searchFilter,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  useWindowTitle(
    `${pod?.name || "Host"} in ${cluster?.name || "cluster"} virtual machines`
  );
  useActivePod(hostId);
  const redirectURL = useKVMDetailsRedirect(hostId);

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
  if (!cluster) {
    return <Spinner text="Loading..." />;
  }
  return (
    <LXDHostVMs
      clusterId={clusterId}
      hostId={hostId}
      onRefreshClick={() => {
        // TODO: Open cluster refresh form.
        return null;
      }}
      searchFilter={searchFilter}
      setSearchFilter={setSearchFilter}
      setHeaderContent={setHeaderContent}
    />
  );
};

export default LXDClusterHostVMs;
