import { GenericTable } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";

import useFabricsTableColumns from "./useFabricsTableColumns/useFabricsTableColumns";

import { useFabrics } from "@/app/api/query/fabrics";
import usePagination from "@/app/base/hooks/usePagination/usePagination";

const FabricsTable = () => {
  const { page, size, handlePageSizeChange, setPage } = usePagination(50);
  const { data, isPending, error, isError } = useFabrics();
  const columns = useFabricsTableColumns();

  if (isError) {
    return (
      <Notification title="Error while fetching fabrics">
        {error.message}
      </Notification>
    );
  }

  return (
    <GenericTable
      aria-label="Fabrics table"
      columns={columns}
      data={data?.items ?? []}
      isLoading={isPending}
      noData="No fabrics found."
      pagination={{
        currentPage: page,
        dataContext: "fabrics",
        handlePageSizeChange,
        isPending: isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: data?.total ?? 0,
      }}
    />
  );
};

export default FabricsTable;
