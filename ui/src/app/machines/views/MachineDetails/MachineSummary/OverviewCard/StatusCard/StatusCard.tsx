import { Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { PowerTypeNames } from "app/store/general/constants";
import type { MachineDetails } from "app/store/machine/types";
import { useFormattedOS } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { NodeStatusCode, TestStatusStatus } from "app/store/types/node";
import { breakLines } from "app/utils";

type Props = {
  machine: MachineDetails;
};

const isVM = (machine: MachineDetails, machineTags: Tag[]) => {
  if (machineTags.some((tag) => tag.name === "virtual")) {
    return true;
  }
  const vmPowerTypes = [
    PowerTypeNames.LXD,
    PowerTypeNames.VIRSH,
    PowerTypeNames.VMWARE,
  ];
  return vmPowerTypes.some((type) => type === machine.power_type);
};

const showFailedTestsWarning = (machine: MachineDetails) => {
  switch (machine.status_code) {
    case NodeStatusCode.COMMISSIONING:
    case NodeStatusCode.TESTING:
      return false;
  }

  return machine.testing_status.status === TestStatusStatus.FAILED;
};

const StatusCard = ({ machine }: Props): JSX.Element => {
  const formattedOS = useFormattedOS(machine);
  const machineTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, machine.tags)
  );

  return (
    <>
      <div className="overview-card__status">
        <strong className="p-muted-heading">
          {isVM(machine, machineTags)
            ? "Virtual Machine Status"
            : "Machine Status"}
        </strong>

        <h4 className="u-no-margin--bottom">
          {machine.locked && (
            <i className="p-icon--locked is-inline" data-testid="locked">
              Locked
            </i>
          )}
          {machine.status}
        </h4>

        {machine.show_os_info ? (
          <p className="u-text--muted" data-testid="os-info">
            {formattedOS}
          </p>
        ) : null}
        {machine.error_description &&
        machine.status_code === NodeStatusCode.BROKEN ? (
          <p
            className="u-text--muted u-truncate"
            data-testid="error-description"
          >
            <Tooltip
              message={breakLines(machine.error_description)}
              position="btm-left"
              positionElementClassName="p-double-row__tooltip-inner"
              tooltipClassName="p-tooltip--fixed-width"
            >
              {machine.error_description}
            </Tooltip>
          </p>
        ) : null}
      </div>
      {showFailedTestsWarning(machine) ? (
        <div
          className="overview-card__test-warning u-flex-bottom"
          data-testid="failed-test-warning"
        >
          <i className="p-icon--warning">Warning:</i>
          <span className="u-nudge-right--x-small">
            {" "}
            Some tests failed, use with caution.
          </span>
        </div>
      ) : null}
    </>
  );
};

export default StatusCard;
