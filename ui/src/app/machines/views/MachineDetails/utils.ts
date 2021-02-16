import { scriptStatus } from "app/base/enum";
import type { ScriptResult } from "app/store/scriptresult/types";

export const getTestResultsIcon = (result: ScriptResult): string => {
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
