import { useEffect } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  searchFilter: string;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

export enum Label {
  Title = "LXD cluster VMs",
}

const LXDClusterVMs = ({
  clusterId,
  searchFilter,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clusterVMs = useSelector((state: RootState) =>
    vmClusterSelectors.getFilteredVMs(state, clusterId, searchFilter)
  );
  useWindowTitle(`${cluster?.name || "Cluster"} virtual machines`);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

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
        searchFilter={searchFilter}
        setHeaderContent={setHeaderContent}
        setSearchFilter={setSearchFilter}
        vms={clusterVMs}
      />
    </div>
  );
};

export default LXDClusterVMs;
