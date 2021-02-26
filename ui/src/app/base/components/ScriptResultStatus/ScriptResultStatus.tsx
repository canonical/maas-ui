import type {
  PartialScriptResult,
  ScriptResult,
} from "app/store/scriptresult/types";
import { ScriptResultStatus as ScriptStatus } from "app/store/scriptresult/types";

type Props = { scriptResult: ScriptResult | PartialScriptResult };

const getTestResultsIcon = (
  result: ScriptResult | PartialScriptResult
): string => {
  switch (result.status) {
    case ScriptStatus.PENDING:
      return "p-icon--pending";
    case ScriptStatus.RUNNING:
    case ScriptStatus.APPLYING_NETCONF:
    case ScriptStatus.INSTALLING:
      return "p-icon--running";
    case ScriptStatus.PASSED:
      return "p-icon--success";
    case ScriptStatus.FAILED:
    case ScriptStatus.ABORTED:
    case ScriptStatus.DEGRADED:
    case ScriptStatus.FAILED_APPLYING_NETCONF:
    case ScriptStatus.FAILED_INSTALLING:
      return "p-icon--error";
    case ScriptStatus.TIMEDOUT:
      return "p-icon--timed-out";
    case ScriptStatus.SKIPPED:
      return "p-icon--warning";
    case ScriptStatus.NONE:
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
