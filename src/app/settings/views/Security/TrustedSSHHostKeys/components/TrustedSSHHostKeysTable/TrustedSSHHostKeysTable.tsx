import { GenericTable, MainToolbar } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";

import useTrustedSSHHostKeysTableColumns from "./useTrustedSSHHostKeysTableColumns";

import { useTrustedSshHostKeys } from "@/app/api/query/trustedSshHostKeys";
import usePagination from "@/app/base/hooks/usePagination/usePagination";

const TrustedSSHHostKeysTable = () => {
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const { data, isPending, isError, error } = useTrustedSshHostKeys({
    query: {
      page: debouncedPage,
      size,
    },
  });

  const columns = useTrustedSSHHostKeysTableColumns();

  return (
    <div className="trusted-ssh-host-keys-table">
      <MainToolbar>
        <MainToolbar.Title>Trusted SSH host keys</MainToolbar.Title>
      </MainToolbar>
      {isError && (
        <Notification
          severity="negative"
          title="Error while fetching trusted SSH host keys"
        >
          {error.message}
        </Notification>
      )}
      <GenericTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isPending}
        noData="No trusted SSH host keys found."
        pagination={{
          currentPage: page,
          dataContext: "trusted SSH host keys",
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

export default TrustedSSHHostKeysTable;
