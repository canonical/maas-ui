import React from "react";

import type { MachineDetails } from "app/store/machine/types";
import { nodeStatus, scriptStatus } from "app/base/enum";

type Props = {
  machine: MachineDetails;
};

const StatusCard = ({ machine }: Props): JSX.Element => {
  const isVM = machine.tags?.includes("virtual");
  const showFailedTestsWarning = () => {
    switch (machine.status_code) {
      case nodeStatus.COMMISSIONING:
      case nodeStatus.TESTING:
        return false;
    }

    return (
      machine.testing_status.status === scriptStatus.FAILED ||
      scriptStatus.FAILED_INSTALLING ||
      scriptStatus.DEGRADED ||
      scriptStatus.TIMEDOUT
    );
  };

  return (
    <div className="overview-card__status">
      <strong className="p-muted-heading">
        {isVM ? "Virtual Machine Status" : "Machine Status"}
      </strong>

      <h4 className="u-no-margin--bottom" data-test="locked">
        {machine.locked ? (
          <i className="p-icon--locked" ng-if="node.locked">
            Locked:{" "}
          </i>
        ) : null}
        {machine.status}
      </h4>

      {machine.show_os_info ? (
        <p className="p-text--muted" data-test="os-info">
          {`${machine.osystem}/${machine.distro_series}`}
        </p>
      ) : null}

      {showFailedTestsWarning() ? (
        <div
          className="overview-card__test-warning u-flex-bottom"
          data-test="failed-test-warning"
        >
          <i className="p-icon--warning">Warning:</i> Some tests failed, use
          with caution.
        </div>
      ) : null}
    </div>
  );
};

export default StatusCard;
