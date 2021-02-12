import React, { useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TableMenu from "app/base/components/TableMenu";
import { scriptStatus } from "app/base/enum";
import { useTrackById } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type {
  PartialScriptResult,
  ScriptResult,
  ScriptResultHistory,
} from "app/store/scriptresult/types";

type Props = { scriptResults: ScriptResult[] };

const renderExpandedContent = (
  result: ScriptResult,
  history: ScriptResultHistory,
  hasVisibleHistory: boolean
) => {
  return (
    <div>
      {hasVisibleHistory ? (
        <table
          role="grid"
          className="p-table-expanding--light p-table--machine-commissioning"
        >
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
    </div>
  );
};

const getIcon = (result: ScriptResult) => {
  switch (result.status) {
    case scriptStatus.PENDING:
      return "p-icon--pending";
    case scriptStatus.RUNNING:
    case scriptStatus.APPLYING_NETCONF:
    case scriptStatus.INSTALLING:
      return "p-icon--running";
    case scriptStatus.PASSED:
      return "p-icon--success";
    case scriptStatus.FAILED:
    case scriptStatus.ABORTED:
    case scriptStatus.DEGRADED:
    case scriptStatus.FAILED_APPLYING_NETCONF:
    case scriptStatus.FAILED_INSTALLING:
      return "p-icon--error";
    case scriptStatus.TIMEDOUT:
      return "p-icon--timed-out";
    case scriptStatus.SKIPPED:
      return "p-icon--warning";
    case scriptStatus.NONE:
      return "";
    default:
      return "p-icon--help";
  }
};

const renderActions = (
  result: ScriptResult,
  toggleHistory: (id: ScriptResult["id"]) => void,
  hasHistory: boolean,
  hasVisibleHistory: boolean
) => {
  const links = [];
  if (!hasHistory) {
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

  return (
    <TableMenu
      data-test="action-menu"
      links={links}
      position="right"
      title="Take action:"
    />
  );
};

const MachineCommissioningTable = ({ scriptResults }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const history = useSelector(scriptResultSelectors.history);

  const {
    tracked: visibleHistory,
    toggleTracked: toggleHistory,
  } = useTrackById();

  useEffect(() => {
    const noHistory = Object.keys(history).every((scriptResultId) => {
      const historicalScripts = history[Number(scriptResultId)] || [];
      return historicalScripts.length === 0;
    });

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
    const hasVisibleHistory = visibleHistory?.some((id) => id === result.id);
    const isExpanded = hasVisibleHistory;
    rows.push({
      expanded: isExpanded,
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <span data-test="name">
              <i className={`is-inline ${getIcon(result)}`} />
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
          content: (
            <span data-test="status">
              {result.status_name}{" "}
              {result.status === scriptStatus.PASSED ||
              result.status === scriptStatus.FAILED ||
              result.status === scriptStatus.TIMEDOUT ||
              result.status === scriptStatus.DEGRADED ||
              result.status === scriptStatus.FAILED_INSTALLING ||
              result.status === scriptStatus.SKIPPED ||
              result.status === scriptStatus.FAILED_APPLYING_NETCONF ? (
                <Link to={`commissioning/${result.id}/details`}>
                  View details
                </Link>
              ) : null}
            </span>
          ),
        },
        {
          content: renderActions(
            result,
            toggleHistory,
            hasHistory,
            hasVisibleHistory
          ),
          className: "u-align--right",
        },
      ],
      expandedContent: renderExpandedContent(
        result,
        history,
        hasVisibleHistory
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
        className="p-table-expanding--light p-table--machine-commissioning"
        defaultSort="name"
        defaultSortDirection="ascending"
        headers={[
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

export default MachineCommissioningTable;
