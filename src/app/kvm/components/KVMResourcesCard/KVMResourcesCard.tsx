import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoreResources from "../CoreResources";
import RamResources from "../RamResources";
import VfResources from "../VfResources";
import VmResources from "../VmResources";

import machineSelectors from "app/store/machine/selectors";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const KVMResourcesCard = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  useFetchMachines();

  if (pod) {
    const {
      cpu_over_commit_ratio,
      memory_over_commit_ratio,
      resources: {
        cores,
        interfaces,
        memory: { general, hugepages },
      },
    } = pod;
    const coresWithOver = resourceWithOverCommit(cores, cpu_over_commit_ratio);
    const generalWithOver = resourceWithOverCommit(
      general,
      memory_over_commit_ratio
    );
    return (
      <>
        <div className="kvm-resources-card">
          <RamResources
            dynamicLayout
            generalAllocated={generalWithOver.allocated_tracked}
            generalFree={generalWithOver.free}
            generalOther={generalWithOver.allocated_other}
            hugepagesAllocated={hugepages.allocated_tracked}
            hugepagesFree={hugepages.free}
            hugepagesOther={hugepages.allocated_other}
          />
          <CoreResources
            allocated={coresWithOver.allocated_tracked}
            dynamicLayout
            free={coresWithOver.free}
            other={coresWithOver.allocated_other}
          />
          <VfResources dynamicLayout interfaces={interfaces} />
        </div>
        <VmResources loading={machinesLoading} vms={podVMs} />
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMResourcesCard;
