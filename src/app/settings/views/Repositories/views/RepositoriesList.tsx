import DeleteRepository from "../components/DeleteRepository/DeleteRepository";
import EditRepository from "../components/EditRepository";
import RepositoryForm from "../components/RepositoryForm";
import RepositoriesTable from "../components/RepositoryTable/RepositoriesTable";
import { RepositoryActionSidePanelViews } from "../constants";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";

export enum Labels {
  Actions = "Table actions",
  SearchboxPlaceholder = "Search package repositories",
}

export const RepositoriesList = (): React.ReactElement => {
  let content = null;
  const { sidePanelContent } = useSidePanel();

  if (sidePanelContent?.view) {
    if (sidePanelContent.view === RepositoryActionSidePanelViews.ADD_PPA) {
      content = <RepositoryForm type="ppa" />;
    } else if (
      sidePanelContent.view === RepositoryActionSidePanelViews.ADD_REPOSITORY
    ) {
      content = <RepositoryForm type="repository" />;
    } else if (
      sidePanelContent.view ===
        RepositoryActionSidePanelViews.EDIT_REPOSITORY &&
      sidePanelContent.extras &&
      "repositoryId" in sidePanelContent.extras &&
      "type" in sidePanelContent.extras
    ) {
      content = (
        <EditRepository
          id={sidePanelContent.extras.repositoryId}
          type={sidePanelContent.extras.type}
        />
      );
    } else if (
      sidePanelContent.view ===
        RepositoryActionSidePanelViews.DELETE_REPOSITORY &&
      sidePanelContent.extras &&
      "repositoryId" in sidePanelContent.extras
    )
      content = <DeleteRepository id={sidePanelContent.extras.repositoryId} />;
  }

  useWindowTitle("Package repos");

  return (
    <PageContent
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Repositories", sidePanelContent)}
    >
      <RepositoriesTable />
    </PageContent>
  );
};

export default RepositoriesList;
