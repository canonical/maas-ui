import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import OverallResourcesCard from "./OverallResourcesCard";
import ProjectResourcesCard from "./ProjectResourcesCard";

import { useWindowTitle } from "app/base/hooks";
import PodStorage from "app/kvm/components/PodStorage";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const LxdResources = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  useWindowTitle(`LXD resources ${pod?.name || ""}`);

  if (!!pod) {
    return (
      <>
        <Strip className="u-no-padding--top" shallow>
          <h4 className="u-sv1">Overall</h4>
          <OverallResourcesCard resources={pod.resources} />
        </Strip>
        <Strip shallow>
          <div className="u-flex--between u-flex--column-x-small">
            <h4 className="u-sv1">{pod.project}</h4>
          </div>
          <ProjectResourcesCard id={pod.id} />
        </Strip>
        <Strip shallow>
          <PodStorage id={pod.id} />
        </Strip>
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default LxdResources;
