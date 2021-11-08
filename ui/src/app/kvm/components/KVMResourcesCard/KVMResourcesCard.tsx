import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import CoreResources from "../CoreResources";
import RamResources from "../RamResources";
import VfResources from "../VfResources";
import VmResources from "../VmResources";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const KVMResourcesCard = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (pod) {
    const { cpu_over_commit_ratio, memory_over_commit_ratio, resources } = pod;
    const { interfaces, memory } = resources;
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
        <div className="kvm-resources-card">
          <RamResources
            dynamicLayout
            general={{
              allocated: general.allocated_tracked,
              free: general.free,
            }}
            hugepages={{
              allocated: hugepages.allocated_tracked,
              free: hugepages.free,
            }}
          />
          <CoreResources
            cores={{
              allocated: cores.allocated_tracked,
              free: cores.free,
            }}
            dynamicLayout
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
