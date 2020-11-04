import React from "react";
import { Link } from "react-router-dom";

import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";

import type { SetSelectedAction } from "../../MachineSummary";
import { useSendAnalytics } from "app/base/hooks";
import type { MachineDetails } from "app/store/machine/types";
import { HardwareType } from "app/base/enum";

type Props = {
  machine: MachineDetails;
  setSelectedAction: SetSelectedAction;
};

const hasTestsRun = (machine: MachineDetails, scriptType: string) => {
  const testObj = machine[`${scriptType}_test_status`];
  return (
    testObj.passed + testObj.pending + testObj.running + testObj.failed > 0
  );
};

const MemoryCard = ({ machine, setSelectedAction }: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  const testsTabUrl = `/machine/${machine.system_id}/tests`;

  return (
    <>
      <div className="overview-card__memory">
        <strong className="p-muted-heading">Memory</strong>
        <h4>{machine.memory ? machine.memory + " GiB" : "Unknown"}</h4>
      </div>

      <div className="overview-card__memory-tests u-flex--vertically">
        <ul className="p-inline-list u-no-margin--bottom" data-test="tests">
          {machine.memory_test_status.passed > 0 ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Memory tests passed link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.success} />
                {machine.memory_test_status.passed}
              </Button>
            </li>
          ) : null}

          {machine.memory_test_status.pending +
            machine.memory_test_status.running >
          0 ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Memory tests running link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={"pending"} />
                {machine.memory_test_status.pending +
                  machine.memory_test_status.running}
              </Button>
            </li>
          ) : null}

          {machine.memory_test_status.failed > 0 ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Memory tests failed",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.error} />
                {machine.memory_test_status.failed}
              </Button>
            </li>
          ) : null}

          {hasTestsRun(machine, "memory") ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "View memory tests results",
                    "Machine summary tab"
                  )
                }
              >
                View results&nbsp;&rsaquo;
              </Button>
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
                        formProps: { hardwareType: HardwareType.Memory },
                      },
                      false
                    );
                    sendAnalytics(
                      "Machine details",
                      "Test memory",
                      "Machine summary tab"
                    );
                  }}
                >
                  Test memory...
                </Button>
              </Tooltip>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MemoryCard;
