import { Tooltip } from "@canonical/react-components";
import type { Position } from "@canonical/react-components/dist/components/Tooltip/Tooltip";

import ScriptStatus from "app/base/components/ScriptStatus";
import { TestStatusStatus } from "app/store/types/node";

type Props = {
  children: React.ReactNode;
  status: TestStatusStatus;
  tooltipPosition?: Position;
};

const MachineTestStatus = ({
  children,
  status,
  tooltipPosition = "top-right",
}: Props): JSX.Element => {
  switch (status) {
    case TestStatusStatus.PASSED:
      // We only want to show icons for tests that have not passed.
      return <>{children}</>;

    case TestStatusStatus.FAILED:
      return (
        <Tooltip
          message="Machine has failed tests."
          position={tooltipPosition}
          positionElementClassName="p-double-row__tooltip-inner"
        >
          <ScriptStatus status={status}>{children}</ScriptStatus>
        </Tooltip>
      );

    default:
      return <ScriptStatus status={status}>{children}</ScriptStatus>;
  }
};

export default MachineTestStatus;
