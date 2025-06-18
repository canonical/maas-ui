import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import RepositoryForm from "../RepositoryForm";

import { useFetchActions } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import type { RootState } from "@/app/store/root/types";

export const RepositoryEdit = (): React.ReactElement => {
  const { sidePanelContent } = useSidePanel();
  const id =
    sidePanelContent?.extras && "repositoryId" in sidePanelContent.extras
      ? sidePanelContent.extras.repositoryId
      : null;
  const type =
    sidePanelContent?.extras && "type" in sidePanelContent.extras
      ? sidePanelContent.extras.type
      : null;

  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const repository = useSelector((state: RootState) =>
    repositorySelectors.getById(state, id)
  );

  useFetchActions([repositoryActions.fetch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if ((loaded && !repository) || !type) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm repository={repository} type={type} />;
};

export default RepositoryEdit;
