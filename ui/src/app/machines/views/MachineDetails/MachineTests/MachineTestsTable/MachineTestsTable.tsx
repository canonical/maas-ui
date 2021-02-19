import React, { useState } from "react";

import { Input, MainTable } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import { getTestResultsIcon } from "../../utils";

import TestActions from "./TestActions";
import TestHistory from "./TestHistory";
import TestMetrics from "./TestMetrics";

import { scriptStatus } from "app/base/enum";
import { useSendAnalytics } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";
import type { ScriptResult } from "app/store/scriptresult/types";

export enum ScriptResultAction {
  VIEW_METRICS = "viewMetrics",
  VIEW_PREVIOUS_TESTS = "viewPreviousTests",
}

export type Expanded = {
  id: ScriptResult["id"];
  content: ScriptResultAction;
};

export type SetExpanded = (expanded: Expanded) => void;

type Props = { machineId: Machine["system_id"]; scriptResults: ScriptResult[] };

const isSuppressible = (result: ScriptResult) =>
  result.status === scriptStatus.FAILED ||
  result.status === scriptStatus.FAILED_INSTALLING ||
  result.status === scriptStatus.TIMEDOUT ||
  result.status === scriptStatus.FAILED_APPLYING_NETCONF;

const MachineTestsTable = ({
  machineId,
  scriptResults,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const sendAnalytics = useSendAnalytics();
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const closeExpanded = () => setExpanded(null);
  const rows: TSFixMe = [];

  scriptResults.forEach((result) => {
    const isExpanded = expanded?.id === result.id;

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
                      if (result.suppressed) {
                        dispatch(
                          machineActions.unsuppressScriptResults(machineId, [
                            result,
                          ])
                        );
                        sendAnalytics(
                          "Machine testing",
                          "Unsuppress script result failure",
                          "Unsuppress"
                        );
                      } else {
                        dispatch(
                          machineActions.suppressScriptResults(machineId, [
                            result,
                          ])
                        );
                        sendAnalytics(
                          "Machine testing",
                          "Suppress script result failure",
                          "Suppress"
                        );
                      }
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
              <i className={`is-inline ${getTestResultsIcon(result)}`} />
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
          content: (
            <TestActions scriptResult={result} setExpanded={setExpanded} />
          ),
          className: "u-align--right",
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
        expanding
        className="p-table-expanding--light p-table--machine-tests-table"
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
