import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";

import { Icon, Input, Tooltip } from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

import type { NodeTestRow } from "../NodeTestsTable";
import ScriptRunTime from "../components/ScriptRunTime";

import ScriptStatus from "@/app/base/components/ScriptStatus";
import { useSendAnalytics } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import type { ControllerDetails } from "@/app/store/controller/types";
import { machineActions } from "@/app/store/machine";
import type { MachineDetails } from "@/app/store/machine/types";
import type { ScriptResult } from "@/app/store/scriptresult/types";
import { ScriptResultType } from "@/app/store/scriptresult/types";
import { canBeSuppressed } from "@/app/store/scriptresult/utils";
import { nodeIsMachine } from "@/app/store/utils";
import { formatUtcDatetime } from "@/app/utils/time";

export enum ScriptResultAction {
  VIEW_PREVIOUS_TESTS = "viewPreviousTests",
}

export type Expanded = {
  id: ScriptResult["id"];
  content: ScriptResultAction;
};

export type SetExpanded = (expanded: Expanded) => void;

type NodeTestsTableColumnDef = ColumnDef<NodeTestRow, Partial<NodeTestRow>>;

const getScriptResultUrl = (
  node: ControllerDetails | MachineDetails,
  isMachine: boolean,
  scriptResult: ScriptResult
) => {
  const params = {
    id: node.system_id,
    scriptResultId: scriptResult.id,
  };
  if (!isMachine) {
    return urls.controllers.controller.commissioning.scriptResult(params);
  }
  const { commissioning, deployment, testing } =
    urls.machines.machine.scriptsResults;
  switch (scriptResult.result_type) {
    case ScriptResultType.COMMISSIONING:
      return commissioning.scriptResult(params);
    case ScriptResultType.DEPLOYMENT:
      return deployment.scriptResult(params);
    default:
      return testing.scriptResult(params);
  }
};

const useNodeTestsTableColumns = ({
  node,
  scriptResults,
  expanded,
  setExpanded,
}: {
  node: ControllerDetails | MachineDetails;
  scriptResults: ScriptResult[];
  expanded: Expanded | null;
  setExpanded: Dispatch<SetStateAction<Expanded | null>>;
}): NodeTestsTableColumnDef[] => {
  const dispatch = useDispatch();
  const sendAnalytics = useSendAnalytics();

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
              cell: ({ row }: { row: Row<NodeTestRow> }) => {
                if (!row.original.isHistory) {
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
                } else {
                  return null;
                }
              },
            },
          ]
        : []),
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableSorting: false,
        cell: ({ row }) =>
          !row.original.isHistory ? (
            <Link
              data-testid="details-link"
              to={getScriptResultUrl(node, isMachine, row.original)}
            >
              {row.original.name}
            </Link>
          ) : null,
      },
      {
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
        enableSorting: false,
        cell: ({ row }) =>
          !row.original.isHistory ? <>{row.original.tags}</> : null,
      },
      {
        id: "result",
        header: "Result",
        accessorKey: "result",
        enableSorting: false,
        cell: ({ row }) => (
          <>
            {expanded?.content === ScriptResultAction.VIEW_PREVIOUS_TESTS &&
            row.original.isHistory ? (
              <>
                <ScriptStatus status={row.original.status}>
                  {row.original.status_name}{" "}
                  <Link
                    data-testid="details-link"
                    to={getScriptResultUrl(node, isMachine, row.original)}
                  >
                    View log
                  </Link>
                </ScriptStatus>
              </>
            ) : (
              <ScriptStatus status={row.original.status}>
                {row.original.status_name}
              </ScriptStatus>
            )}
          </>
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
        id: "metrics",
        header: "Metrics",
        accessorKey: "metrics",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.hasMetrics ? (
            <Icon name="success"></Icon>
          ) : (
            <Icon name="minus"></Icon>
          ),
      },
      {
        id: "history",
        header: "",
        accessorKey: "history",
        enableSorting: false,
        cell: ({ row }) =>
          !row.original.isHistory ? (
            <Link
              data-testid="view-history-link"
              onClick={(e) => {
                e.preventDefault();
                setExpanded({
                  id: row.original.id,
                  content: ScriptResultAction.VIEW_PREVIOUS_TESTS,
                });
              }}
              to="#"
            >
              View history
            </Link>
          ) : null,
      },
    ],
    [
      dispatch,
      expanded?.content,
      isMachine,
      node,
      sendAnalytics,
      setExpanded,
      showSuppressCol,
    ]
  );
};

export default useNodeTestsTableColumns;
