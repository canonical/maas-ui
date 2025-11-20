import { GenericTable } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";

import useSpacesTableColumns from "./useSpacesTableColumns/useSpacesTableColumns";

import { useSpaces } from "@/app/api/query/spaces";
import usePagination from "@/app/base/hooks/usePagination/usePagination";

const SpacesTable = () => {
  const { page, size, handlePageSizeChange, setPage } = usePagination(50);
  const { data, isPending, error, isError } = useSpaces();
  const columns = useSpacesTableColumns();

  if (isError) {
    return (
      <Notification title="Error while fetching spaces">
        {error.message}
      </Notification>
    );
  }

  return (
    <GenericTable
      aria-label="Spaces table"
      columns={columns}
      data={data?.items ?? []}
      isLoading={isPending}
      noData="No spaces found."
      pagination={{
        currentPage: page,
        dataContext: "spaces",
        handlePageSizeChange,
        isPending: isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: data?.total ?? 0,
      }}
    />
  );
};

export default SpacesTable;
