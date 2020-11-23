import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import React from "react";
import { Link } from "react-router-dom";

import type { SetSelectedAction } from "..";

import { HardwareType } from "app/base/enum";
import { useSendAnalytics } from "app/base/hooks";
import { capitaliseFirst } from "app/utils";

import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails;
  hardwareType: HardwareType;
  setSelectedAction: SetSelectedAction;
};

const hasTestsRun = (machine: MachineDetails, scriptType: string) => {
  const testObj = machine[`${scriptType}_test_status`];
  return (
    testObj.passed + testObj.pending + testObj.running + testObj.failed > 0
  );
};

const TestResults = ({
  machine,
  hardwareType,
  setSelectedAction,
}: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  const testsTabUrl = `/machine/${machine.system_id}/tests`;
  const scriptType = HardwareType[hardwareType]?.toLowerCase();

  return (
    <div className={`overview-card__${scriptType}-tests u-flex--vertically`}>
      <ul className="p-inline-list u-no-margin--bottom" data-test="tests">
        {machine[`${scriptType}_test_status`].passed ? (
          <li className="p-inline-list__item">
            <Link
              to={testsTabUrl}
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests passed link`,
                  "Machine summary tab"
                )
              }
            >
              <Icon name={ICONS.success} />
              <span className="u-nudge-right--x-small">
                {machine[`${scriptType}_test_status`].passed}
              </span>
            </Link>
          </li>
        ) : null}

        {machine[`${scriptType}_test_status`].pending +
          machine[`${scriptType}_test_status`].running >
        0 ? (
          <li className="p-inline-list__item">
            <Link
              to={testsTabUrl}
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests running link`,
                  "Machine summary tab"
                )
              }
            >
              <Icon name={"pending"} />
              <span className="u-nudge-right--x-small">
                {machine[`${scriptType}_test_status`].pending +
                  machine[`${scriptType}_test_status`].running}
              </span>
            </Link>
          </li>
        ) : null}

        {machine[`${scriptType}_test_status`].failed > 0 ? (
          <li className="p-inline-list__item">
            <Link
              to={testsTabUrl}
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `${capitaliseFirst(scriptType)} tests failed`,
                  "Machine summary tab"
                )
              }
            >
              <Icon name={ICONS.error} />
              <span className="u-nudge-right--x-small">
                {machine[`${scriptType}_test_status`].failed}
              </span>
            </Link>
          </li>
        ) : null}

        {hasTestsRun(machine, scriptType) ? (
          <li className="p-inline-list__item">
            <Link
              to={testsTabUrl}
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  `View ${scriptType} tests results`,
                  "Machine summary tab"
                )
              }
            >
              View results&nbsp;&rsaquo;
            </Link>
          </li>
        ) : (
          <li className="p-inline-list__item">
            <Tooltip
              message={
                !machine.actions.includes("test")
                  ? "Machine cannot run tests at this time."
                  : null
              }
              position={"top-left"}
            >
              <Button
                className="p-button--link"
                disabled={!machine.actions.includes("test")}
                onClick={() => {
                  setSelectedAction(
                    {
                      name: "test",
                      formProps: { hardwareType: hardwareType },
                    },
                    false
                  );
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
