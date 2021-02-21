import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";

type Props = {
  close: () => void;
  scriptResult: ScriptResult;
};

const TestHistory = ({ close, scriptResult }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) =>
    scriptResultSelectors.getHistoryById(state, scriptResult.id)
  );

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
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{historyResult.runtime}</td>
                  <td>{historyResult.updated}</td>
                  <td>{historyResult.status_name}</td>
                  <td></td>
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
