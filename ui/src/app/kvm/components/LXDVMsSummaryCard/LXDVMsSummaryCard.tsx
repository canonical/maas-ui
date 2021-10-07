import CoreResources from "app/kvm/components/CoreResources";
import RamResources from "app/kvm/components/RamResources";
import StorageResources from "app/kvm/components/StorageResources";
import VfResources from "app/kvm/components/VfResources";
import type { PodNetworkInterface, PodStoragePool } from "app/store/pod/types";

type Props = {
  cores: { allocated: number; free: number };
  interfaces: PodNetworkInterface[];
  memory: {
    general: { allocated: number; free: number };
    hugepages: { allocated: number; free: number };
  };
  storage: { allocated: number; free: number; pools: PodStoragePool[] };
};

const LXDVMsSummaryCard = ({
  cores,
  interfaces,
  memory,
  storage,
}: Props): JSX.Element => {
  return (
    <div className="lxd-vms-summary-card">
      <RamResources
        dynamicLayout
        general={memory.general}
        hugepages={memory.hugepages}
      />
      <CoreResources cores={cores} dynamicLayout />
      <StorageResources storage={storage} />
      <VfResources interfaces={interfaces} />
    </div>
  );
};

export default LXDVMsSummaryCard;
