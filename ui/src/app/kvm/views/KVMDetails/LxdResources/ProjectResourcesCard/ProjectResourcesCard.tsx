import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoreResources from "../../CoreResources";
import RamResources from "../../RamResources";
import VfResources from "../../VfResources";
import VmResources from "../../VmResources";

import podSelectors from "app/store/pod/selectors";
import type { Pod, PodResource } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const formatPodResource = (resource: PodResource) => ({
  allocated: resource.allocated_other + resource.allocated_tracked,
  free: resource.free,
});

const ProjectResourcesCard = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );

  if (pod) {
    const { resources } = pod;
    const { cores, interfaces, memory } = resources;
    const { general, hugepages } = memory;
    return (
      <div className="project-resources-card">
        <RamResources
          dynamicLayout
          general={formatPodResource(general)}
          hugepages={formatPodResource(hugepages)}
        />
        <CoreResources cores={formatPodResource(cores)} dynamicLayout />
        <VfResources dynamicLayout interfaces={interfaces} />
        <VmResources vms={podVMs} />
      </div>
    );
  }
  return <Spinner text="Loading" />;
};

export default ProjectResourcesCard;
