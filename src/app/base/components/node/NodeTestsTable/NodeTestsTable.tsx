import { useState } from "react";

import { Input, MainTable, Tooltip } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useDispatch } from "react-redux";

import ScriptRunTime from "./ScriptRunTime";
import TestActions from "./TestActions";
import TestHistory from "./TestHistory";
import TestMetrics from "./TestMetrics";

import ScriptStatus from "@/app/base/components/ScriptStatus";
import TableHeader from "@/app/base/components/TableHeader";
import { useSendAnalytics } from "@/app/base/hooks";
import type { ControllerDetails } from "@/app/store/controller/types";
import { machineActions } from "@/app/store/machine";
import type { MachineDetails } from "@/app/store/machine/types";
import type { ScriptResult } from "@/app/store/scriptresult/types";
import { ScriptResultType } from "@/app/store/scriptresult/types";
import { canBeSuppressed } from "@/app/store/scriptresult/utils";
import { nodeIsMachine } from "@/app/store/utils";
import { formatUtcDatetime } from "@/app/utils/time";

export enum ScriptResultAction {
  VIEW_METRICS = "viewMetrics",
  VIEW_PREVIOUS_TESTS = "viewPreviousTests",
}

export type Expanded = {
  id: ScriptResult["id"];
  content: ScriptResultAction;
};

export type SetExpanded = (expanded: Expanded) => void;

type Props = {
  node: ControllerDetails | MachineDetails;
  scriptResults: ScriptResult[];
};

const NodeTestsTable = ({ node, scriptResults }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const sendAnalytics = useSendAnalytics();
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const closeExpanded = () => {
    setExpanded(null);
  };
  const containsTesting = scriptResults.some(
    (result) => result.result_type === ScriptResultType.TESTING
  );
  const isMachine = nodeIsMachine(node);
  const showSuppressCol = containsTesting && isMachine;
  const rows: MainTableRow[] = [];

  scriptResults.forEach((result) => {
    const isExpanded = expanded?.id === result.id;
    const isSuppressible = canBeSuppressed(result);

    rows.push({
      expanded: isExpanded,
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        ...(showSuppressCol
          ? [
              {
                className: "suppress-col",
                content: (
                  <Tooltip
                    data-testid="suppress-tooltip"
                    message={
                      isSuppressible
                        ? null
                        : "Only failed testing scripts can be suppressed."
                    }
                  >
                    <Input
                      checked={result.suppressed}
                      data-testid="suppress-script-results"
                      disabled={!isSuppressible}
                      id={`suppress-${result.id}`}
                      label=" "
                      labelClassName="p-checkbox--inline u-no-padding--left"
                      onChange={() => {
                        if (showSuppressCol) {
                          if (result.suppressed) {
                            dispatch(
                              machineActions.unsuppressScriptResults(
                                node.system_id,
                                [result]
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
                                [result]
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
                ),
              },
            ]
          : []),
        {
          className: "name-col",
          content: result.name,
        },
        {
          className: "tags-col",
          content: result.tags,
        },
        {
          className: "result-col",
          content: (
            <ScriptStatus status={result.status}>
              {result.status_name}
            </ScriptStatus>
          ),
        },
        {
          className: "date-col",
          content: formatUtcDatetime(result.updated),
        },
        {
          className: "runtime-col",
          content: <ScriptRunTime scriptResult={result} />,
        },
        {
          className: "actions-col u-align--right",
          content: (
            <TestActions
              node={node}
              resultType={
                containsTesting
                  ? ScriptResultType.TESTING
                  : ScriptResultType.COMMISSIONING
              }
              scriptResult={result}
              setExpanded={setExpanded}
            />
          ),
        },
      ],
      expandedContent: isExpanded ? (
        <div className="u-flex--grow">
          {expanded?.content === ScriptResultAction.VIEW_METRICS && (
            <TestMetrics close={closeExpanded} scriptResult={result} />
          )}
          {expanded?.content === ScriptResultAction.VIEW_PREVIOUS_TESTS && (
            <TestHistory close={closeExpanded} scriptResult={result} />
          )}
        </div>
      ) : null,
      key: result.id,
      sortData: {
        name: result.name,
        date: result.updated,
      },
    });
  });

  return (
    <>
      <MainTable
        aria-label="Test results"
        className="node-tests-table p-table-expanding--light"
        emptyStateMsg="No results available."
        expanding
        headers={[
          ...(showSuppressCol
            ? [
                {
                  className: "suppress-col",
                  content: <TableHeader>Suppress</TableHeader>,
                },
              ]
            : []),
          {
            className: "name-col",
            content: <TableHeader>Name</TableHeader>,
          },
          {
            className: "tags-col",
            content: <TableHeader>Tags</TableHeader>,
          },
          {
            className: "result-col",
            content: (
              <TableHeader className="p-double-row__header-spacer">
                Result
              </TableHeader>
            ),
          },
          {
            className: "date-col",
            content: <TableHeader>Date</TableHeader>,
          },
          {
            className: "runtime-col",
            content: <TableHeader>Runtime</TableHeader>,
          },
          {
            className: "actions-col u-align--right",
            content: <TableHeader>Actions</TableHeader>,
          },
        ]}
        rows={rows}
      />
    </>
  );
};

export default NodeTestsTable;
