import { Input, MainTable } from "@canonical/react-components";

import { scriptStatus } from "app/base/enum";
import type { ScriptResult } from "app/store/scriptresult/types";

type Props = { scriptResults: ScriptResult[] };

const isSuppressible = (result: ScriptResult) =>
  result.status === scriptStatus.FAILED ||
  result.status === scriptStatus.FAILED_INSTALLING ||
  result.status === scriptStatus.TIMEDOUT ||
  result.status === scriptStatus.FAILED_APPLYING_NETCONF;

const MachineTestsTable = ({ scriptResults }: Props): JSX.Element => {
  return (
    <>
      <MainTable
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
        rows={scriptResults.map((result) => {
          return {
            columns: [
              {
                content: (
                  <>
                    {isSuppressible(result) ? (
                      <>
                        <Input
                          type="checkbox"
                          id={`suppress-${result.id}`}
                          label=" "
                          checked={result.suppressed}
                          onChange={() => null}
                        />
                      </>
                    ) : null}
                  </>
                ),
              },
              {
                content: <span data-test="name">{result.name || "—"}</span>,
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
                content: "",
                className: "u-align--right",
              },
            ],
            key: result.id,
            sortData: {
              name: result.name,
              date: result.updated,
            },
          };
        })}
        sortable
      />
    </>
  );
};

export default MachineTestsTable;
