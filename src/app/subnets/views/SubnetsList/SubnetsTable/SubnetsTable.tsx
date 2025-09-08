import { GenericTable } from "@canonical/maas-react-components";

import { useSubnetsTable, useSubnetsTableSearch } from "./hooks";
import useSubnetsTableColumns from "./useSubnetsTableColumns/useSubnetsTableColumns";

import usePagination from "@/app/base/hooks/usePagination/usePagination";
import type { SubnetGroupByProps } from "@/app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsTable = ({
  groupBy,
  searchText,
}: Pick<SubnetGroupByProps, "groupBy"> & {
  searchText: string;
}): React.ReactElement | null => {
  const subnetsTable = useSubnetsTable(groupBy);
  const { data, loaded } = useSubnetsTableSearch(subnetsTable, searchText);
  const columns = useSubnetsTableColumns();
  const { page, size, handlePageSizeChange, setPage } = usePagination();

  return (
    <GenericTable
      columns={columns}
      data={data.slice((page - 1) * size, page * size)}
      filterCells={(row, column) =>
        row.getIsGrouped()
          ? column.id === "groupName"
          : column.id !== "groupName"
      }
      filterHeaders={(header) => header.column.id !== "groupName"}
      groupBy={["groupName"]}
      isLoading={!loaded}
      noData={"No results found"}
      pagination={{
        currentPage: page,
        dataContext: "subnets",
        handlePageSizeChange,
        isPending: !loaded,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: data.length,
      }}
    />
  );
};

export default SubnetsTable;
