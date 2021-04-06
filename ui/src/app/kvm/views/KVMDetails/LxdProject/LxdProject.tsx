import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import ProjectSummaryCard from "./ProjectSummaryCard";
import ProjectVMs from "./ProjectVMs";

import { useWindowTitle } from "app/base/hooks";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
  setSelectedAction: SetSelectedAction;
};

const LxdProjects = ({ id, setSelectedAction }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useWindowTitle(`LXD project ${pod?.project || ""}`);

  if (!podsLoaded) {
    return <Spinner text="Loading" />;
  }

  if (!pod) {
    return (
      <h4 className="u-sv1" data-test="not-found">
        Unable to find pod with id: {id}
      </h4>
    );
  }

  if (pod.type !== PodType.LXD) {
    return <Redirect to={`/kvm/${id}/resources`} />;
  }

  return (
    <>
      <h4 className="u-sv1" data-test="project-name">
        {pod.project}
      </h4>
      <ProjectSummaryCard id={id} />
      <ProjectVMs id={id} setSelectedAction={setSelectedAction} />
    </>
  );
};

export default LxdProjects;
