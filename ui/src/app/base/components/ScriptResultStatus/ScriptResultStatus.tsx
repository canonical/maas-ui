import { scriptStatus } from "app/base/enum";
import type {
  PartialScriptResult,
  ScriptResult,
} from "app/store/scriptresult/types";

type Props = { scriptResult: ScriptResult | PartialScriptResult };

const getTestResultsIcon = (
  result: ScriptResult | PartialScriptResult
): string => {
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

const ScriptResultStatus = ({ scriptResult }: Props): JSX.Element => (
  <div className="u-flex">
    <div>
      <i className={getTestResultsIcon(scriptResult)} />
    </div>
    <span className="u-nudge-right--small" data-test="status-name">
      {scriptResult.status_name}
    </span>
  </div>
);

export default ScriptResultStatus;
