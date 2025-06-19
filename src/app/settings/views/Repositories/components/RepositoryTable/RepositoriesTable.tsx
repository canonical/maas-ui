import { GenericTable, MainToolbar } from "@canonical/maas-react-components";
import { Button, Notification } from "@canonical/react-components";

import { RepositoryActionSidePanelViews } from "../../constants";

import useRepositoriesTableColumns from "./useRepositoriesTableColumns";

import { usePackageRepositories } from "@/app/api/query/packageRepositories";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import { useSidePanel } from "@/app/base/side-panel-context";

const RepositoriesTable = () => {
  const { setSidePanelContent } = useSidePanel();
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const { data, isPending, isError, error } = usePackageRepositories({
    query: {
      page: debouncedPage,
      size,
    },
  });

  const columns = useRepositoriesTableColumns();

  return (
    <div className="repositories-table">
      <MainToolbar>
        <MainToolbar.Title>Package repositories</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            onClick={() =>
              setSidePanelContent({
                view: RepositoryActionSidePanelViews.ADD_PPA,
              })
            }
          >
            Add PPA
          </Button>
          <Button
            onClick={() =>
              setSidePanelContent({
                view: RepositoryActionSidePanelViews.ADD_REPOSITORY,
              })
            }
          >
            Add repository
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      {isError && (
        <Notification
          severity="negative"
          title="Error while fetching package repositories"
        >
          {error.message}
        </Notification>
      )}
      <GenericTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isPending}
        noData="No package repositories found."
        pagination={{
          currentPage: page,
          dataContext: "package repositories",
          handlePageSizeChange: handlePageSizeChange,
          isPending: isPending,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: data?.total ?? 0,
        }}
      />
    </div>
  );
};

export default RepositoriesTable;
