import React, { useEffect } from "react";

import { Input, MainTable } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import TableMenu from "app/base/components/TableMenu";
import { scriptStatus } from "app/base/enum";
import { useTrackById } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type {
  PartialScriptResult,
  ScriptResult,
  ScriptResultHistory,
  ScriptResultResult,
} from "app/store/scriptresult/types";

type Props = { machineId: Machine["system_id"]; scriptResults: ScriptResult[] };

const isSuppressible = (result: ScriptResult) =>
  result.status === scriptStatus.FAILED ||
  result.status === scriptStatus.FAILED_INSTALLING ||
  result.status === scriptStatus.TIMEDOUT ||
  result.status === scriptStatus.FAILED_APPLYING_NETCONF;

const renderExpandedContent = (
  result: ScriptResult,
  history: ScriptResultHistory,
  hasVisibleHistory: boolean,
  hasVisibleMetrics: boolean
) => {
  return (
    <div>
      {hasVisibleHistory ? (
        <table role="grid" className="p-table-expanding--light">
          <tbody>
            {history[result.id]?.map((item: PartialScriptResult) => {
              if (item.id !== result.id) {
                return (
                  <tr
                    role="row"
                    data-test="script-result-history"
                    key={`history-${item.id}`}
                  >
                    <td role="gridcell"></td>
                    <td role="gridcell"></td>
                    <td role="gridcell"></td>
                    <td role="gridcell">{item.runtime}</td>
                    <td role="gridcell">{item.updated}</td>
                    <td role="gridcell">{item.status_name}</td>
                    <td role="gridcell"></td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      ) : null}
      {hasVisibleMetrics ? (
        <table role="grid" className="p-table-expanding--light">
          <tbody>
            {result.results.map((item: ScriptResultResult) => (
              <tr
                role="row"
                data-test="script-result-metrics"
                key={`metric-${item.name}`}
              >
                <td role="gridcell">{item.title}</td>
                <td role="gridcell">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

const renderActions = (
  result: ScriptResult,
  toggleHistory: (id: ScriptResult["id"]) => void,
  toggleMetrics: (id: ScriptResult["id"]) => void,
  hasHistory: boolean,
  hasMetrics: boolean,
  hasVisibleHistory: boolean,
  hasVisibleMetrics: boolean
) => {
  const links = [];
  if (!hasHistory && !hasMetrics) {
    return null;
  }

  if (hasHistory) {
    if (!hasVisibleHistory) {
      links.push({
        children: "View previous tests",
        onClick: () => toggleHistory(result.id),
        "data-test": "action-menu-show-previous",
      });
    } else {
      links.push({
        children: "Hide previous tests",
        onClick: () => toggleHistory(result.id),
        "data-test": "action-menu-hide-previous",
      });
    }
  }

  if (hasMetrics) {
    if (!hasVisibleMetrics) {
      links.push({
        children: "View metrics",
        onClick: () => toggleMetrics(result.id),
        "data-test": "action-menu-show-metrics",
      });
    } else {
      links.push({
        children: "Hide metrics",
        onClick: () => toggleMetrics(result.id),
        "data-test": "action-menu-hide-metrics",
      });
    }
  }

  return (
    <TableMenu
      data-test="action-menu"
      links={links}
      position="right"
      title="Take action:"
    />
  );
};

const MachineTestsTable = ({
  machineId,
  scriptResults,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  const history = useSelector(scriptResultSelectors.history);

  const {
    tracked: visibleHistory,
    toggleTracked: toggleHistory,
  } = useTrackById();

  const {
    tracked: visibleMetrics,
    toggleTracked: toggleMetrics,
  } = useTrackById();

  useEffect(() => {
    const noHistory = Object.keys(history).every((k) => !history[k].length);
    if (noHistory) {
      scriptResults.forEach((scriptResult) => {
        dispatch(scriptResultActions.getHistory(scriptResult.id));
      });
    }
  }, [dispatch, history, scriptResults]);

  const rows: TSFixMe = [];

  scriptResults.forEach((result) => {
    const hasHistory =
      history[result.id]?.filter((item) => item.id !== result.id).length > 0; // filter for self
    const hasMetrics = result.results.length > 0;
    const hasVisibleMetrics = visibleMetrics?.some((id) => id === result.id);
    const hasVisibleHistory = visibleHistory?.some((id) => id === result.id);
    const isExpanded = hasVisibleMetrics || hasVisibleHistory;

    rows.push({
      expanded: isExpanded,
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <>
              {isSuppressible(result) ? (
                <>
                  <Input
                    type="checkbox"
                    id={`suppress-${result.id}`}
                    data-test="suppress-script-results"
                    label=" "
                    checked={result.suppressed}
                    onChange={() => {
                      result.suppressed
                        ? dispatch(
                            machineActions.unsuppressScriptResults(machineId, [
                              result,
                            ])
                          )
                        : dispatch(
                            machineActions.suppressScriptResults(machineId, [
                              result,
                            ])
                          );
                    }}
                  />
                </>
              ) : null}
            </>
          ),
        },
        {
          content: (
            <span data-test="name">
              <i
                className={classNames("is-inline", {
                  "p-icon--success": result.status === scriptStatus.PASSED,
                  "p-icon--error": result.status !== scriptStatus.PASSED,
                })}
              />
              {result.name || "—"}
            </span>
          ),
        },
        {
          content: <span data-test="tags">{result.tags}</span>,
        },
        {
          content: <span data-test="runtime">{result.runtime}</span>,
        },
        {
          content: <span data-test="date">{result.updated}</span>,
        },
        {
          content: <span data-test="status">{result.status_name}</span>,
        },
        {
          content: renderActions(
            result,
            toggleHistory,
            toggleMetrics,
            hasHistory,
            hasMetrics,
            hasVisibleHistory,
            hasVisibleMetrics
          ),
          className: "u-align--right",
        },
      ],
      expandedContent: renderExpandedContent(
        result,
        history,
        hasVisibleHistory,
        hasVisibleMetrics
      ),
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
        expanding
        className="p-table-expanding--light"
        defaultSort="name"
        defaultSortDirection="ascending"
        headers={[
          {
            content: "Suppress",
          },
          {
            content: "Name",
            sortKey: "name",
          },
          {
            content: "Tags",
          },
          {
            content: "Runtime",
          },
          {
            content: "Date",
            sortKey: "date",
          },
          {
            content: "Result",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        rows={rows}
        sortable
      />
    </>
  );
};

export default MachineTestsTable;
