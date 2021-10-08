import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import LXDHostToolbar from "./LXDHostToolbar";
import NumaResources from "./NumaResources";

import type { SetSearchFilter } from "app/base/types";
import LXDVMsSummaryCard from "app/kvm/components/LXDVMsSummaryCard";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId?: VMCluster["id"];
  hostId: Pod["id"];
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
};

const LXDHostVMs = ({
  clusterId,
  hostId,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const vms = useSelector((state: RootState) =>
    podSelectors.filteredVMs(state, hostId, searchFilter)
  );
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, hostId)
  );
  const [viewByNuma, setViewByNuma] = useStorageState(
    localStorage,
    `viewPod${hostId}ByNuma`,
    false
  );

  if (pod) {
    const { cpu_over_commit_ratio, memory_over_commit_ratio, resources } = pod;
    const { interfaces, memory, storage } = resources;
    const cores = resourceWithOverCommit(
      resources.cores,
      cpu_over_commit_ratio
    );
    const general = resourceWithOverCommit(
      memory.general,
      memory_over_commit_ratio
    );
    const hugepages = memory.hugepages; // Hugepages do not take over-commit into account
    return (
      <>
        <LXDHostToolbar
          clusterId={clusterId}
          hostId={hostId}
          setHeaderContent={setHeaderContent}
          setViewByNuma={setViewByNuma}
          viewByNuma={viewByNuma}
        />
        {viewByNuma ? (
          <NumaResources id={hostId} />
        ) : (
          <LXDVMsSummaryCard
            cores={{
              allocated: cores.allocated_other + cores.allocated_tracked,
              free: cores.free,
            }}
            interfaces={interfaces}
            memory={{
              general: {
                allocated: general.allocated_other + general.allocated_tracked,
                free: general.free,
              },
              hugepages: {
                allocated:
                  hugepages.allocated_other + hugepages.allocated_tracked,
                free: hugepages.free,
              },
            }}
            storage={{
              allocated: storage.allocated_other + storage.allocated_tracked,
              free: storage.free,
              pools: sortedPools,
            }}
          />
        )}
        <LXDVMsTable
          getResources={(vm) => {
            const resources =
              pod.resources.vms.find(
                ({ system_id }) => system_id === vm.system_id
              ) || null;
            return {
              hugepagesBacked: resources?.hugepages_backed || false,
              pinnedCores: resources?.pinned_cores || [],
              unpinnedCores: resources?.unpinned_cores || 0,
            };
          }}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          setHeaderContent={setHeaderContent}
          vms={vms}
        />
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default LXDHostVMs;
