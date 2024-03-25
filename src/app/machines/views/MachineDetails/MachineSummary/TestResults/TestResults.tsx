import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import { Link } from "react-router-dom";

import { HardwareType } from "@/app/base/enum";
import { useSendAnalytics } from "@/app/base/hooks";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import type { MachineDetails } from "@/app/store/machine/types";
import type { TestStatus } from "@/app/store/types/node";
import { NodeActions } from "@/app/store/types/node";
import { capitaliseFirst } from "@/app/utils";

type Props = {
  machine: MachineDetails;
  hardwareType: HardwareType;
  setSidePanelContent: MachineSetSidePanelContent;
};

const hasTestsRun = (testStatus: TestStatus) =>
  testStatus.passed +
    testStatus.pending +
    testStatus.running +
    testStatus.failed >
  0;

const TestResults = ({
  machine,
  hardwareType,
  setSidePanelContent,
}: Props): JSX.Element | null => {
  const sendAnalytics = useSendAnalytics();

  const testsTabUrl = `/machine/${machine.system_id}/testing`;
  const scriptType = HardwareType[hardwareType]?.toLowerCase();
  let testStatus: TestStatus | null = null;
  switch (hardwareType) {
    case HardwareType.CPU:
      testStatus = machine.cpu_test_status;
      break;
    case HardwareType.Memory:
      testStatus = machine.memory_test_status;
      break;
    case HardwareType.Storage:
      testStatus = machine.storage_test_status;
      break;
    case HardwareType.Network:
      testStatus = machine.network_test_status;
      break;
  }

  if (!testStatus) {
    return null;
  }

  return (
    <div className={`overview-card__${scriptType}-tests u-flex--vertically`}>
      <ul className="p-inline-list u-no-margin--bottom" data-testid="tests">
        {testStatus.passed ? (
          <li className="p-inline-list__item">
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests passed link`,
                  "Machine summary tab"
                )
              }
              to={testsTabUrl}
            >
              <Icon name={ICONS.success} />
              <span className="u-nudge-right--x-small">
                {testStatus.passed}
              </span>
            </Link>
          </li>
        ) : null}

        {testStatus.pending + testStatus.running > 0 ? (
          <li className="p-inline-list__item">
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests running link`,
                  "Machine summary tab"
                )
              }
              to={testsTabUrl}
            >
              <Icon name={"pending"} />
              <span className="u-nudge-right--x-small">
                {testStatus.pending + testStatus.running}
              </span>
            </Link>
          </li>
        ) : null}

        {testStatus.failed > 0 ? (
          <li className="p-inline-list__item">
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests failed`,
                  "Machine summary tab"
                )
              }
              to={testsTabUrl}
            >
              <Icon name={ICONS.error} />
              <span className="u-nudge-right--x-small">
                {testStatus.failed}
              </span>
            </Link>
          </li>
        ) : null}

        {hasTestsRun(testStatus) ? (
          <li className="p-inline-list__item">
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `View ${scriptType} tests results`,
                  "Machine summary tab"
                )
              }
              to={testsTabUrl}
            >
              View results&nbsp;&rsaquo;
            </Link>
          </li>
        ) : (
          <li className="p-inline-list__item">
            <Tooltip
              message={
                !machine.actions.includes(NodeActions.TEST)
                  ? "Machine cannot run tests at this time."
                  : null
              }
              position={"top-left"}
            >
              <Button
                appearance="link"
                className="u-no-margin--bottom"
                disabled={!machine.actions.includes(NodeActions.TEST)}
                onClick={() => {
                  setSidePanelContent({
                    view: MachineSidePanelViews.TEST_MACHINE,
                    extras: { hardwareType: hardwareType },
                  });
                  sendAnalytics(
                    "Machine details",
                    `Test ${scriptType}`,
                    "Machine summary tab"
                  );
                }}
              >
                {hardwareType === HardwareType.CPU
                  ? "Test CPU…"
                  : `Test ${scriptType}…`}
              </Button>
            </Tooltip>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TestResults;
