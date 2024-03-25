import { Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import { useWindowTitle } from "@/app/base/hooks";
import type { SetSearchFilter } from "@/app/base/types";
import urls from "@/app/base/urls";
import LXDVMsTable from "@/app/kvm/components/LXDVMsTable";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import type { RootState } from "@/app/store/root/types";
import vmClusterSelectors from "@/app/store/vmcluster/selectors";
import type { VMCluster } from "@/app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  searchFilter: string;
  setSidePanelContent: KVMSetSidePanelContent;
  setSearchFilter: SetSearchFilter;
};

export enum Label {
  Title = "LXD cluster VMs",
}

const LXDClusterVMs = ({
  clusterId,
  searchFilter,
  setSidePanelContent,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  useWindowTitle(`${cluster?.name || "Cluster"} virtual machines`);

  if (!cluster) {
    return null;
  }
  return (
    <div aria-label={Label.Title}>
      <Strip shallow>
        <LXDClusterSummaryCard clusterId={clusterId} />
      </Strip>
      <LXDVMsTable
        displayForCluster
        getHostColumn={(machine) => {
          if (machine.pod) {
            return (
              <Link
                data-testid="host-link"
                to={urls.kvm.lxd.cluster.vms.host({
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
        pods={cluster.hosts.map(({ name }) => name)}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setSidePanelContent={setSidePanelContent}
      />
    </div>
  );
};

export default LXDClusterVMs;
