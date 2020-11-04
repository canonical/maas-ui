import pluralize from "pluralize";
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

const StorageCard = ({ machine, setSelectedAction }: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  const testsTabUrl = `/machine/${machine.system_id}/tests`;

  return (
    <>
      <div className="overview-card__storage">
        <strong className="p-muted-heading">Storage</strong>
        <h4>
          <span>{machine.storage ? `${machine.storage}GB` : "Unknown"}</span>
          {machine.storage && machine.physical_disk_count ? (
            <span className="p-muted-text">
              &nbsp;over {pluralize("disk", machine.physical_disk_count, true)}
            </span>
          ) : null}
        </h4>
      </div>

      <div className="overview-card__storage-tests u-flex--vertically">
        <ul className="p-inline-list u-no-margin--bottom" data-test="tests">
          {machine.storage_test_status.passed ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Storage tests passed link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.success} />
                {machine.storage_test_status.passed}
              </Button>
            </li>
          ) : null}

          {machine.storage_test_status.pending +
            machine.storage_test_status.running >
          0 ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Storage tests running link",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={"pending"} />
                {machine.storage_test_status.pending +
                  machine.storage_test_status.running}
              </Button>
            </li>
          ) : null}

          {machine.storage_test_status.failed > 0 ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "Storage tests failed",
                    "Machine summary tab"
                  )
                }
              >
                <Icon name={ICONS.error} />
                {machine.storage_test_status.failed}
              </Button>
            </li>
          ) : null}

          {hasTestsRun(machine, "storage") ? (
            <li className="p-inline-list__item">
              <Button
                className="p-button--link"
                element={Link}
                to={testsTabUrl}
                onClick={() =>
                  sendAnalytics(
                    "Machine details",
                    "View storagte tests results",
                    "Machine summary tab"
                  )
                }
              >
                View results&nbsp;&rsaquo;
              </Button>
            </li>
          ) : (
            <li className="p-inline-list__item">
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
                          formProps: { hardwareType: HardwareType.Storage },
                        },
                        false
                      );
                      sendAnalytics(
                        "Machine details",
                        "Test storage",
                        "Machine summary tab"
                      );
                    }}
                  >
                    Test storage...
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

export default StorageCard;
