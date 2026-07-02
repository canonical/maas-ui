import {
  GenericTable,
  MainToolbar,
  useSidePanel,
} from "@canonical/maas-react-components";
import {
  Button,
  Notification as NotificationBanner,
} from "@canonical/react-components";

import { Entitlement } from "../../../UserManagement/views/Groups/constants";

import useRepositoriesTableColumns from "./useRepositoriesTableColumns/useRepositoriesTableColumns";

import { usePackageRepositories } from "@/app/api/query/packageRepositories";
import { useHasEntitlements } from "@/app/base/hooks";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import { AddRepository } from "@/app/settings/views/Repositories/components";

const RepositoriesTable = () => {
  const { openSidePanel } = useSidePanel();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const { data, isPending, isError, error } = usePackageRepositories({
    query: {
      page: debouncedPage,
      size,
    },
  });

  const columns = useRepositoriesTableColumns({ canEdit });

  return (
    <div className="repositories-table">
      <MainToolbar>
        <MainToolbar.Title>Package repositories</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            disabled={!canEdit}
            onClick={() => {
              openSidePanel({
                component: AddRepository,
                title: "Add PPA",
                props: { type: "ppa" },
              });
            }}
          >
            Add PPA
          </Button>
          <Button
            disabled={!canEdit}
            onClick={() => {
              openSidePanel({
                component: AddRepository,
                title: "Add repository",
                props: { type: "repository" },
              });
            }}
          >
            Add repository
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      {isError && (
        <NotificationBanner
          severity="negative"
          title="Error while fetching package repositories"
        >
          {error.message}
        </NotificationBanner>
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
