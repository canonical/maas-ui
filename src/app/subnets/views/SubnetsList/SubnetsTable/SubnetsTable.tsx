import SubnetsControls from "../SubnetsControls";

import FabricTable from "./FabricTable";
import SpaceTable from "./SpaceTable";
import { SubnetsColumns } from "./constants";
import { useSubnetsTable, useSubnetsTableSearch } from "./hooks";

import type { SubnetGroupByProps } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsTable = ({
  groupBy,
  searchText,
  setSearchText,
}: Pick<SubnetGroupByProps, "groupBy"> & {
  searchText: string;
  setSearchText: (text: string) => void;
}): JSX.Element | null => {
  const subnetsTable = useSubnetsTable(groupBy);
  const { data, loaded } = useSubnetsTableSearch(subnetsTable, searchText);

  const emptyMsg = !loaded ? "Loading..." : "No results found";

  return (
    <>
      <SubnetsControls
        groupBy={groupBy}
        handleSearch={setSearchText}
        searchText={searchText}
      />

      {groupBy === SubnetsColumns.FABRIC ? (
        <FabricTable data={data} emptyMsg={emptyMsg} />
      ) : (
        <SpaceTable data={data} emptyMsg={emptyMsg} />
      )}
    </>
  );
};

export default SubnetsTable;
