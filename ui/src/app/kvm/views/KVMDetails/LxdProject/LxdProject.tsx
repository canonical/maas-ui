import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import ProjectSummaryCard from "./ProjectSummaryCard";
import ProjectVMs from "./ProjectVMs";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
};

const LxdProject = ({
  id,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useWindowTitle(`LXD project ${pod?.power_parameters?.project || ""}`);

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
    return <Redirect to={kvmURLs.virsh.details.index({ id })} />;
  }

  return (
    <>
      <h4 className="u-sv1" data-test="project-name">
        {pod.power_parameters?.project}
      </h4>
      <ProjectSummaryCard id={id} />
      <ProjectVMs
        id={id}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setHeaderContent={setHeaderContent}
      />
    </>
  );
};

export default LxdProject;
