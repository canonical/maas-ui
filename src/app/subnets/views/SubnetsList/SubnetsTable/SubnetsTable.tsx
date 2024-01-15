import FabricTable from "./FabricTable";
import SpaceTable from "./SpaceTable";
import { SubnetsColumns } from "./constants";
import { useSubnetsTable, useSubnetsTableSearch } from "./hooks";

import type { SubnetGroupByProps } from "@/app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsTable = ({
  groupBy,
  searchText,
}: Pick<SubnetGroupByProps, "groupBy"> & {
  searchText: string;
}): JSX.Element | null => {
  const subnetsTable = useSubnetsTable(groupBy);
  const { data, loaded } = useSubnetsTableSearch(subnetsTable, searchText);

  const emptyMsg = !loaded ? "Loading..." : "No results found";

  return (
    <>
      {groupBy === SubnetsColumns.FABRIC ? (
        <FabricTable data={data} emptyMsg={emptyMsg} />
      ) : (
        <SpaceTable data={data} emptyMsg={emptyMsg} />
      )}
    </>
  );
};

export default SubnetsTable;
