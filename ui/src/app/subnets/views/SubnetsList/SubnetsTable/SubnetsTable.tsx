import { useState } from "react";

import FabricTable from "./FabricTable";
import SpaceTable from "./SpaceTable";
import { useSubnetsTable, useSubnetsTableSearch } from "./hooks";

import SubnetsControls from "app/subnets/views/SubnetsList/SubnetsControls";
import type { SubnetGroupByProps } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsTable = ({
  groupBy,
  setGroupBy,
}: SubnetGroupByProps): JSX.Element | null => {
  const [searchText, setSearchText] = useState("");
  const subnetsTable = useSubnetsTable(groupBy);
  const { data, loaded } = useSubnetsTableSearch(subnetsTable, searchText);

  const handleSearch = (searchText: string): void => {
    setSearchText(searchText);
  };

  const emptyMsg = !loaded ? "Loading..." : "No results found";

  return (
    <>
      <SubnetsControls
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        handleSearch={handleSearch}
      />

      {groupBy === "fabric" ? (
        <FabricTable data={data} emptyMsg={emptyMsg} />
      ) : (
        <SpaceTable data={data} emptyMsg={emptyMsg} />
      )}
    </>
  );
};

export default SubnetsTable;
