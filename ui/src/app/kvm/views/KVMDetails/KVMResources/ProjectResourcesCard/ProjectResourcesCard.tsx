import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoreResources from "../../CoreResources";
import RamResources from "../../RamResources";
import VfResources from "../../VfResources";
import VmResources from "../../VmResources";

import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const ProjectResourcesCard = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, id)
  );

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
      <div className="project-resources-card">
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
        <VmResources vms={podVMs} />
      </div>
    );
  }
  return <Spinner text="Loading" />;
};

export default ProjectResourcesCard;
