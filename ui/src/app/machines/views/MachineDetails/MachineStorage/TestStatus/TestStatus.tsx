import { scriptStatus } from "app/base/enum";
import type { Disk } from "app/store/machine/types";

type Props = { testStatus: Disk["test_status"] };

const TestStatus = ({ testStatus }: Props): JSX.Element => {
  switch (testStatus) {
    case scriptStatus.PENDING:
      return <i className="p-icon--pending"></i>;
    case scriptStatus.RUNNING:
    case scriptStatus.APPLYING_NETCONF:
    case scriptStatus.INSTALLING:
      return <i className="p-icon--running"></i>;
    case scriptStatus.PASSED:
      return (
        <>
          <i className="p-icon--success is-inline"></i>
          <span>OK</span>
        </>
      );
    case scriptStatus.FAILED:
    case scriptStatus.ABORTED:
    case scriptStatus.DEGRADED:
    case scriptStatus.FAILED_APPLYING_NETCONF:
    case scriptStatus.FAILED_INSTALLING:
      return (
        <>
          <i className="p-icon--error is-inline"></i>
          <span>Error</span>
        </>
      );
    case scriptStatus.TIMEDOUT:
      return (
        <>
          <i className="p-icon--timed-out is-inline"></i>
          <span>Timed out</span>
        </>
      );
    case scriptStatus.SKIPPED:
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
