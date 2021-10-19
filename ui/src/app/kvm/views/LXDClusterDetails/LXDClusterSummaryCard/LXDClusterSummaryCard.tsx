import classNames from "classnames";
import { useSelector } from "react-redux";

import CoreResources from "app/kvm/components/CoreResources";
import RamResources from "app/kvm/components/RamResources";
import StorageResources from "app/kvm/components/StorageResources";
import VfResources from "app/kvm/components/VfResources";
import podSelectors from "app/store/pod/selectors";
import type { PodNetworkInterface } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  showStorage?: boolean;
};

const LXDClusterSummaryCard = ({
  clusterId,
  showStorage = true,
}: Props): JSX.Element | null => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clusterHosts = useSelector((state: RootState) =>
    podSelectors.lxdHostsInClusterById(state, clusterId)
  );

  if (!cluster) {
    return null;
  }

  const { cpu, memory, storage } = cluster.total_resources;
  const interfaces = clusterHosts.reduce<PodNetworkInterface[]>(
    (interfaces, host) => {
      host.resources.interfaces.forEach((hostIface) => {
        const existingIface = interfaces.find(
          (iface) => iface.id === hostIface.id
        );
        if (!existingIface) {
          interfaces.push(hostIface);
        }
      });
      return interfaces;
    },
    []
  );
  return (
    <div
      className={classNames("lxd-cluster-summary-card", {
        "show-storage": showStorage,
      })}
    >
      <RamResources
        dynamicLayout
        general={{
          allocated: memory.general.total - memory.general.free,
          free: memory.general.free,
        }}
        hugepages={{
          allocated: memory.hugepages.total - memory.hugepages.free,
          free: memory.hugepages.free,
        }}
      />
      <CoreResources
        cores={{
          allocated: cpu.total - cpu.free,
          free: cpu.free,
        }}
        dynamicLayout
      />
      {showStorage && (
        <StorageResources
          data-test="lxd-cluster-storage"
          storage={{
            allocated: storage.total - storage.free,
            free: storage.free,
            // TODO: Update with generic storage pool data
            pools: [],
          }}
        />
      )}
      <VfResources dynamicLayout interfaces={interfaces} showAggregated />
    </div>
  );
};

export default LXDClusterSummaryCard;
