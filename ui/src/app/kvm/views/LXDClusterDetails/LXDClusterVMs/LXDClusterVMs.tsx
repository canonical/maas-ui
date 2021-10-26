import { Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  searchFilter: string;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const LXDClusterVMs = ({
  clusterId,
  searchFilter,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clusterVMs = useSelector((state: RootState) =>
    vmClusterSelectors.getFilteredVMs(state, clusterId, searchFilter)
  );
  useWindowTitle(`${cluster?.name || "Cluster"} virtual machines`);

  if (!cluster) {
    return null;
  }
  return (
    <>
      <Strip shallow>
        <LXDClusterSummaryCard clusterId={clusterId} />
      </Strip>
      <LXDVMsTable
        getHostColumn={(machine) => {
          if (machine.pod) {
            return (
              <Link
                data-test="host-link"
                to={kvmURLs.lxd.cluster.vms.host({
                  clusterId,
                  hostId: machine.pod.id,
                })}
              >
                {machine.pod.name}
              </Link>
            );
          }
          return "";
        }}
        getResources={(machine) => {
          const vmInCluster =
            cluster?.virtual_machines.find(
              (vm) => vm.system_id === machine.system_id
            ) || null;
          return {
            hugepagesBacked: vmInCluster?.hugepages_backed || false,
            pinnedCores: vmInCluster?.pinned_cores || [],
            unpinnedCores: vmInCluster?.unpinned_cores || 0,
          };
        }}
        onRefreshClick={() => {
          if (cluster.hosts.length) {
            setHeaderContent({
              view: KVMHeaderViews.REFRESH_KVM,
              extras: { hostIds: cluster.hosts.map((host) => host.id) },
            });
          }
        }}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setHeaderContent={setHeaderContent}
        vms={clusterVMs}
      />
    </>
  );
};

export default LXDClusterVMs;
