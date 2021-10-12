import { Col, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import LxdKVMHostTable from "./LxdKVMHostTable";
import type { LxdKVMHostTableRow } from "./LxdKVMHostTable/LxdKVMHostTable";

import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";

export const generateSingleHostRows = (pods: Pod[]): LxdKVMHostTableRow[] =>
  pods.map((pod) => {
    return {
      cpuCores: pod.resources.cores,
      cpuOverCommit: pod.cpu_over_commit_ratio,
      defaultPoolID: pod.default_storage_pool,
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

const LxdTable = (): JSX.Element | null => {
  const pods = useSelector(podSelectors.lxd);
  const loading = useSelector(podSelectors.loading);
  const loaded = useSelector(podSelectors.loaded);
  const rows = generateSingleHostRows(pods);
  if (loading) {
    return <Spinner data-test="loading-table" text="Loading..." />;
  }
  if (loaded && !pods.length) {
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
