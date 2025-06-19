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

  switch (sidePanelContent?.view) {
    case RepositoryActionSidePanelViews.ADD_PPA:
      content = <RepositoryForm type="ppa" />;
      break;
    case RepositoryActionSidePanelViews.ADD_REPOSITORY:
      content = <RepositoryForm type="repository" />;
      break;
    case RepositoryActionSidePanelViews.EDIT_REPOSITORY:
      content = <EditRepository />;
      break;
    case RepositoryActionSidePanelViews.DELETE_REPOSITORY:
      content = <DeleteRepository />;
      break;
    default:
      content = null;
      break;
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
