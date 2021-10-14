import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useWindowTitle } from "app/base/hooks";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
};

const LXDClusterHosts = ({ clusterId }: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clusterHosts = useSelector((state: RootState) =>
    podSelectors.lxdHostsInClusterById(state, clusterId)
  );
  const podsLoaded = useSelector(podSelectors.loaded);
  useWindowTitle(`${cluster?.name || "LXD cluster"} VM hosts`);

  if (!cluster || !podsLoaded) {
    return <Spinner text="Loading..." />;
  }

  return (
    <ul>
      {clusterHosts.map((host) => (
        <li key={`${host.name}-${host.id}`}>
          <Link
            data-test="cluster-member-link"
            to={kvmURLs.lxd.cluster.vms.host({ clusterId, hostId: host.id })}
          >
            {host.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LXDClusterHosts;
