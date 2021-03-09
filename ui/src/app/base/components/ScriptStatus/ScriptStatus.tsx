import { Icon } from "@canonical/react-components";

import { ScriptResultStatus } from "app/store/scriptresult/types";
import { TestStatusStatus } from "app/store/types/node";

type Props = {
  children?: React.ReactNode;
  status: ScriptResultStatus | TestStatusStatus;
};

const getIconName = (status: ScriptResultStatus | TestStatusStatus): string => {
  switch (status) {
    case ScriptResultStatus.PENDING:
    case TestStatusStatus.PENDING:
      return "pending";
    case ScriptResultStatus.RUNNING:
    case ScriptResultStatus.APPLYING_NETCONF:
    case ScriptResultStatus.INSTALLING:
    case TestStatusStatus.RUNNING:
      return "running";
    case ScriptResultStatus.PASSED:
    case TestStatusStatus.PASSED:
      return "success";
    case ScriptResultStatus.FAILED:
    case ScriptResultStatus.ABORTED:
    case ScriptResultStatus.DEGRADED:
    case ScriptResultStatus.FAILED_APPLYING_NETCONF:
    case ScriptResultStatus.FAILED_INSTALLING:
    case TestStatusStatus.FAILED:
      return "error";
    case ScriptResultStatus.TIMEDOUT:
      return "timed-out";
    case ScriptResultStatus.SKIPPED:
      return "warning";
    case ScriptResultStatus.NONE:
    case TestStatusStatus.NONE:
      return "";
    default:
      return "";
  }
};

const ScriptStatus = ({ children, status }: Props): JSX.Element => {
  const iconName = getIconName(status);

  return (
    <span>
      {iconName && (
        <Icon className={children ? "is-inline" : null} name={iconName} />
      )}
      {children}
    </span>
  );
};

export default ScriptStatus;
