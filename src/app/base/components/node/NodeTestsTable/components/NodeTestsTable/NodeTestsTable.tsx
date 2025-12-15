import { useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { SortingState } from "@tanstack/react-table";

import useNodeTestsTableColumns from "../useNodeTestsTableColumns/useNodeTestsTableColumns";

import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import type { ScriptResult } from "@/app/store/scriptresult/types";

type Props = {
  node: ControllerDetails | MachineDetails;

  scriptResults: ScriptResult[];
};

const useGetNodeTestsTableData = (data: ScriptResult[]) => {
  data.forEach(() => {
    // const history = useSelector((state: RootState) =>
    //   scriptResultSelectors.getHistoryById(state, scriptResult.id)
    //);
    //here i would have to get history for each row - script to see if there is data to show -
    //for reference see TestHistory.tsx
  });
};

const NodeTestsTable = ({ node, scriptResults }: Props) => {
  const columns = useNodeTestsTableColumns({ node, scriptResults });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  return (
    <GenericTable
      aria-label="Test results"
      className="node-tests-table p-table-expanding--light"
      columns={columns}
      data={scriptResults}
      getSubRows={(originalRow) => originalRow.children}
      isLoading={false}
      noData="No results available."
      setSorting={setSorting}
      sorting={sorting}
      variant="regular"
    />
  );
};

export default NodeTestsTable;
