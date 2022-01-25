import FabricTable from "./FabricTable";
import SpaceTable from "./SpaceTable";
import { useSubnetsTable } from "./hooks";

import SubnetsControls from "app/subnets/views/SubnetsList/SubnetsControls";
import type { SubnetGroupByProps } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsTable = ({
  groupBy,
  setGroupBy,
}: SubnetGroupByProps): JSX.Element | null => {
  const { rows } = useSubnetsTable(groupBy);

  return (
    <>
      <SubnetsControls groupBy={groupBy} setGroupBy={setGroupBy} />

      {groupBy === "fabric" ? (
        <FabricTable rows={rows} />
      ) : (
        <SpaceTable rows={rows} />
      )}
    </>
  );
};

export default SubnetsTable;
