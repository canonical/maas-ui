import type { Disk } from "app/store/machine/types";
import { ScriptResultStatus } from "app/store/scriptresult/types";

type Props = { testStatus: Disk["test_status"] };

const TestStatus = ({ testStatus }: Props): JSX.Element => {
  switch (testStatus) {
    case ScriptResultStatus.PENDING:
      return <i className="p-icon--pending"></i>;
    case ScriptResultStatus.RUNNING:
    case ScriptResultStatus.APPLYING_NETCONF:
    case ScriptResultStatus.INSTALLING:
      return <i className="p-icon--running"></i>;
    case ScriptResultStatus.PASSED:
      return (
        <>
          <i className="p-icon--success is-inline"></i>
          <span>OK</span>
        </>
      );
    case ScriptResultStatus.FAILED:
    case ScriptResultStatus.ABORTED:
    case ScriptResultStatus.DEGRADED:
    case ScriptResultStatus.FAILED_APPLYING_NETCONF:
    case ScriptResultStatus.FAILED_INSTALLING:
      return (
        <>
          <i className="p-icon--error is-inline"></i>
          <span>Error</span>
        </>
      );
    case ScriptResultStatus.TIMEDOUT:
      return (
        <>
          <i className="p-icon--timed-out is-inline"></i>
          <span>Timed out</span>
        </>
      );
    case ScriptResultStatus.SKIPPED:
      return (
        <>
          <i className="p-icon--warning is-inline"></i>
          <span>Skipped</span>
        </>
      );
    default:
      return (
        <>
          <i className="p-icon--power-unknown is-inline"></i>
          <span>Unknown</span>
        </>
      );
  }
};

export default TestStatus;
