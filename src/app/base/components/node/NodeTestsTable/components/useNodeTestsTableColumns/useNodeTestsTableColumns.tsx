import { useMemo, useState } from "react";

import { Input, Tooltip } from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useDispatch } from "react-redux";

import ScriptRunTime from "../../ScriptRunTime";
import TestActions from "../../TestActions";

import ScriptStatus from "@/app/base/components/ScriptStatus";
import { useSendAnalytics } from "@/app/base/hooks";
import type { ControllerDetails } from "@/app/store/controller/types";
import { machineActions } from "@/app/store/machine";
import type { MachineDetails } from "@/app/store/machine/types";
import type { ScriptResult } from "@/app/store/scriptresult/types";
import { ScriptResultType } from "@/app/store/scriptresult/types";
import { canBeSuppressed } from "@/app/store/scriptresult/utils";
import { nodeIsMachine } from "@/app/store/utils";
import { formatUtcDatetime } from "@/app/utils/time";

type Props = {
  node: ControllerDetails | MachineDetails;
  scriptResults: ScriptResult[];
};
export enum ScriptResultAction {
  VIEW_METRICS = "viewMetrics",
  VIEW_PREVIOUS_TESTS = "viewPreviousTests",
}

export type Expanded = {
  id: ScriptResult["id"];
  content: ScriptResultAction;
};

export type SetExpanded = (expanded: Expanded) => void;

type NodeTestsTableColumnDef = ColumnDef<ScriptResult, Partial<ScriptResult>>;

const useNodeTestsTableColumns = ({
  node,
  scriptResults,
}: Props): NodeTestsTableColumnDef[] => {
  const dispatch = useDispatch();
  const sendAnalytics = useSendAnalytics();
  const [expanded, setExpanded] = useState<Expanded | null>(null);

  const containsTesting = scriptResults.some(
    (result) => result.result_type === ScriptResultType.TESTING
  );
  const isMachine = nodeIsMachine(node);
  const showSuppressCol = containsTesting && isMachine;

  return useMemo(
    () => [
      ...(showSuppressCol
        ? [
            {
              id: "suppress-col",
              header: "Suppress",
              accessorKey: "suppress-col",
              enableSorting: false,
              cell: ({ row }: { row: Row<ScriptResult> }) => {
                const isSuppressible = canBeSuppressed(row.original);
                return (
                  <Tooltip
                    data-testid="suppress-tooltip"
                    message={
                      isSuppressible
                        ? null
                        : "Only failed testing scripts can be suppressed."
                    }
                  >
                    <Input
                      checked={row.original.suppressed}
                      data-testid="suppress-script-results"
                      disabled={!isSuppressible}
                      id={`suppress-${row.original.id}`}
                      label=" "
                      labelClassName="p-checkbox--inline u-no-padding--left"
                      onChange={() => {
                        if (showSuppressCol) {
                          if (row.original.suppressed) {
                            dispatch(
                              machineActions.unsuppressScriptResults(
                                node.system_id,
                                [row.original]
                              )
                            );
                            sendAnalytics(
                              "Machine testing",
                              "Unsuppress script result failure",
                              "Unsuppress"
                            );
                          } else {
                            dispatch(
                              machineActions.suppressScriptResults(
                                node.system_id,
                                [row.original]
                              )
                            );
                            sendAnalytics(
                              "Machine testing",
                              "Suppress script result failure",
                              "Suppress"
                            );
                          }
                        }
                      }}
                      type="checkbox"
                    />
                  </Tooltip>
                );
              },
            },
          ]
        : []),
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableSorting: false,
        cell: ({ row }) => <>{row.original.name}</>,
      },
      {
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
        enableSorting: false,
        cell: ({ row }) => <>{row.original.tags}</>,
      },
      {
        id: "result",
        header: "Result",
        accessorKey: "result",
        enableSorting: false,
        cell: ({ row }) => (
          <ScriptStatus status={row.original.status}>
            {row.original.status_name}
          </ScriptStatus>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        enableSorting: false,
        cell: ({ row }) => formatUtcDatetime(row.original.updated),
      },
      {
        id: "runtime",
        header: "Runtime",
        accessorKey: "runtime",
        enableSorting: false,
        cell: ({ row }) => <ScriptRunTime scriptResult={row.original} />,
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "actions",
        enableSorting: false,
        cell: ({ row }) => (
          <TestActions
            node={node}
            resultType={
              containsTesting
                ? ScriptResultType.TESTING
                : ScriptResultType.COMMISSIONING
            }
            scriptResult={row.original}
            setExpanded={setExpanded}
          />
        ),
      },
    ],
    [containsTesting, dispatch, node, sendAnalytics, showSuppressCol]
  );
};

export default useNodeTestsTableColumns;
