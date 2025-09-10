import { GenericTable } from "@canonical/maas-react-components";

import { SUBNETS_TABLE_ITEMS_PER_PAGE } from "./constants";
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
  const columns = useSubnetsTableColumns(groupBy);
  const { page, size, handlePageSizeChange, setPage } = usePagination(
    SUBNETS_TABLE_ITEMS_PER_PAGE
  );

  return (
    <GenericTable
      aria-label={`Subnets by ${groupBy}`}
      columns={columns}
      data={data.slice((page - 1) * size, page * size)}
      filterCells={(row, column) =>
        row.getIsGrouped()
          ? ["groupId", groupBy].includes(column.id)
          : !["groupId", groupBy].includes(column.id)
      }
      filterHeaders={(header) =>
        !["groupId", groupBy].includes(header.column.id)
      }
      groupBy={["groupId"]}
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
      pinGroup={groupBy === "space" ? [{ value: "0", isTop: false }] : []}
      variant="full-height"
    />
  );
};

export default SubnetsTable;
