import React from "react";

import type { MachineDetails } from "app/store/machine/types";
import { nodeStatus, scriptStatus } from "app/base/enum";

type Props = {
  machine: MachineDetails;
};

const isVM = (machine: MachineDetails) => {
  if (machine.tags?.includes("virtual")) {
    return true;
  }
  const vmPowerTypes = ["lxd", "virsh", "vmware"];
  return vmPowerTypes.includes(machine.power_type);
};

const showFailedTestsWarning = (machine: MachineDetails) => {
  switch (machine.status_code) {
    case nodeStatus.COMMISSIONING:
    case nodeStatus.TESTING:
      return false;
  }

  return (
    machine.testing_status.status === scriptStatus.FAILED ||
    machine.testing_status.status === scriptStatus.FAILED_INSTALLING ||
    machine.testing_status.status === scriptStatus.DEGRADED ||
    machine.testing_status.status === scriptStatus.TIMEDOUT
  );
};

const StatusCard = ({ machine }: Props): JSX.Element => {
  return (
    <div className="overview-card__status">
      <strong className="p-muted-heading">
        {isVM(machine) ? "Virtual Machine Status" : "Machine Status"}
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

      {showFailedTestsWarning(machine) ? (
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
