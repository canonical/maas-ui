import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ScriptStatus from "app/base/components/ScriptStatus";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";
import { ScriptResultType } from "app/store/scriptresult/types";

type Props = {
  close: () => void;
  scriptResult: ScriptResult;
};

const TestHistory = ({ close, scriptResult }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) =>
    scriptResultSelectors.getHistoryById(state, scriptResult.id)
  );
  const isTesting = scriptResult.result_type === ScriptResultType.TESTING;

  useEffect(() => {
    dispatch(scriptResultActions.getHistory(scriptResult.id));
  }, [dispatch, scriptResult.id]);

  let content: ReactNode;

  if (!history || history?.length <= 1) {
    content = (
      <p className="u-align--center u-no-max-width" data-test="no-history">
        {history?.length === 1 ? (
          "This test has only been run once."
        ) : (
          <Spinner text="Loading..." />
        )}
      </p>
    );
  } else {
    content = (
      <table data-test="history-table">
        <tbody>
          {history?.map((historyResult) => {
            if (historyResult.id !== scriptResult.id) {
              return (
                <tr key={`history-${historyResult.id}`}>
                  {isTesting && <td className="suppress-col"></td>}
                  <td className="name-col"></td>
                  <td className="tags-col"></td>
                  <td className="result-col">
                    <ScriptStatus status={historyResult.status}>
                      {historyResult.status_name}{" "}
                      <Link
                        data-test="details-link"
                        to={(location) =>
                          `${location.pathname}/${historyResult.id}/details`
                        }
                      >
                        View log
                      </Link>
                    </ScriptStatus>
                  </td>
                  <td className="date-col">{historyResult.updated || "—"}</td>
                  <td className="runtime-col">
                    {historyResult.runtime || "—"}
                  </td>
                  <td className="actions-col"></td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {content}
      <div className="u-align--right u-nudge-left--small">
        <Button
          appearance="neutral"
          className="u-no-margin--bottom"
          onClick={() => close()}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default TestHistory;
