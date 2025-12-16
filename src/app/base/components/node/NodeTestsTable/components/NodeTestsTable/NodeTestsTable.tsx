import { useEffect, useMemo, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { SortingState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import useNodeTestsTableColumns from "../useNodeTestsTableColumns/useNodeTestsTableColumns";

import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import { scriptResultActions } from "@/app/store/scriptresult";
import scriptResultSelectors from "@/app/store/scriptresult/selectors";
import type {
  PartialScriptResult,
  ScriptResult,
} from "@/app/store/scriptresult/types";

type Props = {
  node: ControllerDetails | MachineDetails;

  scriptResults: ScriptResult[];
};

export type NodeTestRow = ScriptResult & {
  history?: NodeTestRow[];
};

const getNodeTestsTableData = (
  data: ScriptResult[],
  history: Record<number, PartialScriptResult[]>
) => {
  const newData: NodeTestRow[] = [];
  data.forEach((scriptResult) => {
    newData.push(scriptResult);
  });
  newData.forEach((item) => {
    if (history[item.id]) {
      item.history = history[item.id].map((historyItem) => {
        return {
          ...item,
          ...historyItem,
        };
      });
    }
  });
  return newData;
};

const useScriptResultHistory = (scriptResults: ScriptResult[]) => {
  const history = useSelector(scriptResultSelectors.history);
  const dispatch = useDispatch();

  useEffect(() => {
    scriptResults.forEach((scriptResult) => {
      dispatch(scriptResultActions.getHistory(scriptResult.id));
    });
  }, [dispatch, scriptResults]);

  return history;
};

const NodeTestsTable = ({ node, scriptResults }: Props) => {
  const columns = useNodeTestsTableColumns({ node, scriptResults });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  const history = useScriptResultHistory(scriptResults);
  const data = useMemo(() => {
    return getNodeTestsTableData(scriptResults, history);
  }, [scriptResults, history]);

  return (
    <GenericTable
      aria-label="Test results"
      className="node-tests-table p-table-expanding--light"
      columns={columns}
      data={data}
      getSubRows={(originalRow) => originalRow.history}
      isLoading={false}
      noData="No results available."
      setSorting={setSorting}
      sorting={sorting}
      variant="regular"
    />
  );
};

export default NodeTestsTable;
