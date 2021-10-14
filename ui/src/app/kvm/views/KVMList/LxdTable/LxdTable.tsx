import { Col, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import LxdKVMHostTable from "./LxdKVMHostTable";
import type { LxdKVMHostTableRow } from "./LxdKVMHostTable/LxdKVMHostTable";
import { LxdKVMHostType } from "./LxdKVMHostTable/LxdKVMHostTable";

import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import vmclusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

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
      project: pod.power_parameters.project,
      storage: pod.resources.storage,
      tags: pod.tags,
      url: kvmURLs.lxd.single.index({ id: pod.id }),
      version: pod.version,
      vms: pod.resources.vm_count.tracked,
      zone: pod.zone,
    };
  });

export const generateClusterRows = (
  vmclusters: VMCluster[]
): LxdKVMHostTableRow[] =>
  vmclusters.map((vmcluster) => ({
    cpuCores: vmcluster.total_resources.cpu,
    cpuOverCommit: vmcluster.cpu_over_commit_ratio,
    defaultPoolID: vmcluster.default_storage_pool,
    hostType: LxdKVMHostType.Cluster,
    hostsCount: vmcluster.hosts.length,
    key: vmcluster.id,
    memory: vmcluster.total_resources.memory,
    memoryOverCommit: vmcluster.memory_over_commit_ratio,
    name: vmcluster.name,
    podId: vmcluster.id,
    pool: vmcluster.pool,
    project: vmcluster.power_parameters.project,
    storage: vmcluster.total_resources.storage,
    tags: vmcluster.tags,
    url: kvmURLs.lxd.cluster.index({ clusterId: vmcluster.id }),
    version: vmcluster.version,
    vms: vmcluster.total_resources.vm_count.tracked,
    zone: vmcluster.zone,
  }));

const LxdTable = (): JSX.Element | null => {
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
    return <Spinner data-test="loading-table" text="Loading..." />;
  }
  if (
    singleHostsLoaded &&
    !singleHosts.length &&
    vmclustersLoaded &&
    !vmclusters.length
  ) {
    // TODO: display an empty state.
    // https://github.com/canonical-web-and-design/app-squad/issues/340.
    return null;
  }
  return (
    <Row>
      <Col size={12}>
        <LxdKVMHostTable rows={rows} />
      </Col>
    </Row>
  );
};

export default LxdTable;
