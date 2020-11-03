import pluralize from "pluralize";
import React from "react";
import { Link } from "react-router-dom";

import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";

import { SetSelectedAction } from "../../MachineSummary";
import { useSendAnalytics } from "app/base/hooks";
import type { MachineDetails } from "app/store/machine/types";
import { HardwareType } from "app/base/enum";

type Props = {
  machine: MachineDetails;
  setSelectedAction: SetSelectedAction;
};

const CpuCard = ({ machine, setSelectedAction }: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  const hasTestsRun = (machine: MachineDetails, scriptType: string) => {
    const testObj = machine[`${scriptType}_test_status`];
    return (
      testObj.passed + testObj.pending + testObj.running + testObj.failed > 0
    );
  };

  // Get the subtext for the CPU card. Only nodes commissioned after
  // MAAS 2.4 will have the CPU speed.
  const getCPUSubtext = (machine: MachineDetails) => {
    let text = "Unknown";

    if (machine.cpu_count) {
      text = pluralize("core", machine.cpu_count, true);
    }
    if (machine.cpu_speed) {
      const speedText =
        machine.cpu_speed > 1000
          ? `${machine.cpu_speed / 1000} GHz`
          : `${machine.cpu_speed} MHz`;
      text += `, ${speedText}`;
    }
    return text;
  };

  const testsTabUrl = `/machine/${machine.system_id}/tests`;

  return (
    <>
      <div className="overview-card__cpu">
        <div className="u-flex--between">
          <strong className="p-muted-heading">CPU</strong>
          <span>{machine.architecture}</span>
        </div>
        <h4 className="u-no-margin--bottom" data-test="cpu-subtext">
          {getCPUSubtext(machine)}
        </h4>
        <p className="p-text--muted">
          {machine.metadata.cpu_model || "Unknown model"}
        </p>
      </div>

      <div className="overview-card__cpu-tests u-flex--vertically">
        <ul className="p-inline-list u-no-margin--bottom" data-test="tests">
          {machine.cpu_test_status.passed ? (
            <li className="p-inline-list__item--compact">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "CPU tests passed link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.success} />
                {machine.cpu_test_status.passed}
              </Button>
            </li>
          ) : null}

          {machine.cpu_test_status.pending + machine.cpu_test_status.running >
          0 ? (
            <li className="p-inline-list__item--compact">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "CPU tests running link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={"pending"} />
                {machine.cpu_test_status.pending +
                  machine.cpu_test_status.running}
              </Button>
            </li>
          ) : null}

          {machine.cpu_test_status.failed > 0 ? (
            <li className="p-inline-list__item--compact">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "CPU tests failed",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.error} />
                {machine.cpu_test_status.failed}
              </Button>
            </li>
          ) : null}

          {hasTestsRun(machine, "cpu") ? (
            <li className="p-inline-list__item--compact">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "View CPU tests results",
                    "Machine summary tab"
                  )
                }
              >
                View results&nbsp;&rsaquo;
              </Button>
            </li>
          ) : (
            <li className="p-inline-list__item--compact">
              <span className="p-tooltip--top-left">
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
                          hardwareType: HardwareType.Cpu,
                        },
                        false
                      );
                      sendAnalytics(
                        "Machine details",
                        "Test CPU",
                        "Machine summary tab"
                      );
                    }}
                  >
                    Test CPU...
                  </Button>
                </Tooltip>
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default CpuCard;
