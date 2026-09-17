import { useEffect, useMemo, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { SortingState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import useNodeTestsTableColumns from "./useNodeTestsTableColumns/useNodeTestsTableColumns";

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
  isLoading?: boolean;
  scriptResults: ScriptResult[];
};

export type NodeTestRow = ScriptResult & {
  history?: NodeTestRow[];
  isHistory?: boolean;
  hasMetrics?: boolean;
  hasHistory?: boolean;
};

const getNodeTestsTableData = (
  data: ScriptResult[],
  history: Record<number, PartialScriptResult[]>,
  expandedId: ScriptResult["id"] | null
) => {
  const newData: NodeTestRow[] = [];
  data.forEach((scriptResult) => {
    if (history[scriptResult.id] && scriptResult.id === expandedId) {
      newData.push({
        ...scriptResult,
        history: history[scriptResult.id]
          .filter((historyItem) => historyItem.id !== scriptResult.id)
          .map((historyItem) => {
            return {
              ...scriptResult,
              ...historyItem,
              isHistory: true,
            };
          }),
        hasMetrics: scriptResult.results.length > 0,
        hasHistory: history[scriptResult.id].length > 1,
      });
    } else {
      newData.push({
        ...scriptResult,
        hasMetrics: scriptResult.results.length > 0,
        hasHistory: (history[scriptResult.id]?.length ?? 0) > 1,
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
      if (history[scriptResult.id] && history[scriptResult.id].length === 0) {
        dispatch(scriptResultActions.getHistory(scriptResult.id));
      }
    });
  }, [dispatch, history, scriptResults]);

  return history;
};

const NodeTestsTable = ({ isLoading, node, scriptResults }: Props) => {
  const [expandedId, setExpandedId] = useState<ScriptResult["id"] | null>(null);
  const columns = useNodeTestsTableColumns({
    node,
    scriptResults,
    expandedId,
    setExpandedId,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  const history = useScriptResultHistory(scriptResults);
  const data = useMemo(() => {
    return getNodeTestsTableData(scriptResults, history, expandedId);
  }, [scriptResults, history, expandedId]);

  return (
    <GenericTable
      aria-label="Test results"
      className="node-tests-table p-table-expanding--light"
      columns={columns}
      data={data}
      getSubRows={(originalRow) => originalRow.history}
      isLoading={isLoading || false}
      noData="No results available."
      setSorting={setSorting}
      sorting={sorting}
      variant="regular"
    />
  );
};

export default NodeTestsTable;
