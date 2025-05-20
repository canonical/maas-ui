import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import LxdKVMHostTable from "./LxdKVMHostTable";
import type { LxdKVMHostTableRow } from "./LxdKVMHostTable/LxdKVMHostTable";
import { LxdKVMHostType } from "./LxdKVMHostTable/LxdKVMHostTable";

import urls from "@/app/base/urls";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import vmclusterSelectors from "@/app/store/vmcluster/selectors";
import type { VMCluster } from "@/app/store/vmcluster/types";

export const generateSingleHostRows = (pods: Pod[]): LxdKVMHostTableRow[] =>
  pods.map((pod) => {
    return {
      cpuCores: pod.resources.cores,
      cpuOverCommit: pod.cpu_over_commit_ratio,
      defaultPoolID: pod.default_storage_pool,
      hostType: LxdKVMHostType.Single,
      key: pod.id,
      memory: pod.resources.memory,
      memoryOverCommit: pod.memory_over_commit_ratio,
      name: pod.name,
      podId: pod.id,
      pool: pod.pool,
      project: pod.power_parameters?.project,
      storage: pod.resources.storage,
      storagePools: pod.resources.storage_pools,
      tags: pod.tags,
      url: urls.kvm.lxd.single.index({ id: pod.id }),
      version: pod.version,
      vms: pod.resources.vm_count.tracked,
      zone: pod.zone,
    };
  });

export const generateClusterRows = (
  vmclusters: VMCluster[]
): LxdKVMHostTableRow[] =>
  vmclusters.map((vmcluster) => ({
    clusterId: vmcluster.id,
    cpuCores: vmcluster.total_resources.cpu,
    hostType: LxdKVMHostType.Cluster,
    hostsCount: vmcluster.hosts.length,
    key: vmcluster.id,
    memory: vmcluster.total_resources.memory,
    name: vmcluster.name,
    podId: vmcluster.id,
    pool:
      vmcluster.resource_pool || vmcluster.resource_pool === 0
        ? vmcluster.resource_pool
        : null,
    project: vmcluster.project,
    storage: vmcluster.total_resources.storage,
    storagePools: vmcluster.total_resources.storage_pools,
    url: urls.kvm.lxd.cluster.index({ clusterId: vmcluster.id }),
    version: vmcluster.version,
    vms: vmcluster.virtual_machines.length,
    zone:
      vmcluster.availability_zone || vmcluster.availability_zone === 0
        ? vmcluster.availability_zone
        : null,
  }));

const LxdTable = (): React.ReactElement | null => {
  const singleHosts = useSelector(podSelectors.lxdSingleHosts);
  const singleHostsLoading = useSelector(podSelectors.loading);
  const singleHostsLoaded = useSelector(podSelectors.loaded);
  const vmclusters = useSelector(vmclusterSelectors.all);
  const vmclustersLoading = useSelector(vmclusterSelectors.loading);
  const vmclustersLoaded = useSelector(vmclusterSelectors.loaded);
  const rows = generateSingleHostRows(singleHosts).concat(
    generateClusterRows(vmclusters)
  );

  if (singleHostsLoading || vmclustersLoading) {
    return <Spinner data-testid="loading-table" text="Loading..." />;
  }
  if (
    singleHostsLoaded &&
    !singleHosts.length &&
    vmclustersLoaded &&
    !vmclusters.length
  ) {
    // TODO: display an empty state.
    // https://github.com/canonical/app-squad/issues/340.
    return null;
  }
  return <LxdKVMHostTable rows={rows} />;
};

export default LxdTable;
