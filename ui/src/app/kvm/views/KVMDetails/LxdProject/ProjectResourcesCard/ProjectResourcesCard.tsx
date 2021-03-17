import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoreResources from "../../CoreResources";
import RamResources from "../../RamResources";
import StorageResources from "../../StorageResources";

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
    podSelectors.getById(state, Number(id))
  );

  if (pod) {
    const { resources } = pod;
    const { cores, memory } = resources;
    return (
      <div className="project-resources-card">
        <RamResources
          dynamicLayout
          general={formatPodResource(memory.general)}
          hugepages={formatPodResource(memory.hugepages)}
        />
        <CoreResources cores={formatPodResource(cores)} dynamicLayout />
        <StorageResources />
      </div>
    );
  }

  return <Spinner text="Loading" />;
};

export default ProjectResourcesCard;
