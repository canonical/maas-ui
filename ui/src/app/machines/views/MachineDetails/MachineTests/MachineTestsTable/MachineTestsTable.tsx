import { useEffect, useState } from "react";

import { Input, MainTable } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import TableMenu from "app/base/components/TableMenu";
import { scriptStatus } from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";

type Props = { machineId: Machine["system_id"]; scriptResults: ScriptResult[] };

const isSuppressible = (result: ScriptResult) =>
  result.status === scriptStatus.FAILED ||
  result.status === scriptStatus.FAILED_INSTALLING ||
  result.status === scriptStatus.TIMEDOUT ||
  result.status === scriptStatus.FAILED_APPLYING_NETCONF;

const renderActions = (
  result: ScriptResult,
  showPreviousTests: (id: ScriptResult["id"]) => void,
  hidePreviousTests: (id: ScriptResult["id"]) => void,
  hasHistory: boolean,
  isExpanded: boolean
) => {
  const links = [];
  if (!hasHistory) {
    return null;
  }
  if (!isExpanded) {
    links.push({
      children: "View previous tests",
      onClick: () => showPreviousTests(result.id),
      "data-test": "action-menu-show-previous",
    });
  }
  if (isExpanded) {
    links.push({
      children: "Hide previous tests",
      onClick: () => hidePreviousTests(result.id),
      "data-test": "action-menu-hide-previous",
    });
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
  const [visibleHistory, setVisibleHistory] = useState([]);

  const history = useSelector(scriptResultSelectors.history);

  const showPreviousTests = (id: ScriptResult["id"]) => {
    setVisibleHistory([...new Set([...visibleHistory, id])]);
  };

  const hidePreviousTests = (id: ScriptResult["id"]) => {
    setVisibleHistory([
      ...new Set(visibleHistory.filter((visibleId) => visibleId !== id)),
    ]);
  };

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
    const isExpanded = Boolean(visibleHistory?.find((id) => id === result.id));
    const hasHistory =
      history[result.id]?.filter((item) => item.id !== result.id).length > 0; // filter for self
    rows.push({
      expanded: isExpanded && hasHistory,
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
            showPreviousTests,
            hidePreviousTests,
            hasHistory,
            isExpanded
          ),
          className: "u-align--right",
        },
      ],
      expandedContent: (
        <table role="grid" className="p-table-expanding--light">
          <tbody>
            {history[result.id]?.map((item) => {
              if (item.id !== result.id) {
                return (
                  <tr
                    role="row"
                    data-test="script-result-history"
                    key={item.id}
                    className={isExpanded ? "p-table__row is-active" : ""}
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
