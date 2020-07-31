import PropTypes from "prop-types";
import React from "react";

import { formatBytes } from "app/utils";
import Popover from "app/base/components/Popover";

type Props = {
  assigned: number;
  children: JSX.Element | string;
  physical: number;
  overcommit: number;
};

const RAMPopover = ({
  assigned,
  children,
  physical,
  overcommit,
}: Props): JSX.Element => {
  const totalMemory = formatBytes(physical * overcommit, "MiB", {
    binary: true,
  });
  const physicalMemory = formatBytes(physical, "MiB", {
    binary: true,
  });
  const assignedMemory = formatBytes(assigned, "MiB", {
    binary: true,
  });
  const unassignedMemory = formatBytes(
    physical * overcommit - assigned,
    "MiB",
    {
      binary: true,
    }
  );

  return (
    <Popover
      className="ram-popover"
      content={
        <>
          <div className="ram-popover__primary">
            <div className="ram-popover__value" data-test="assigned">
              <i className="p-icon--assigned is-inline"></i>
              {`${assignedMemory.value} ${assignedMemory.unit}`}
            </div>
            <div>Assigned</div>
            <div className="ram-popover__value" data-test="unassigned">
              <i className="p-icon--unassigned is-inline"></i>
              {`${unassignedMemory.value} ${unassignedMemory.unit}`}
            </div>
            <div>Unassigned</div>
          </div>
          <div className="ram-popover__secondary">
            <div className="ram-popover__value" data-test="physical">
              {`${physicalMemory.value} ${physicalMemory.unit}`}
            </div>
            <div>Physical RAM</div>
            <div className="ram-popover__value">
              &times;&nbsp;&nbsp;
              <span data-test="overcommit">{overcommit}</span>
            </div>
            <div>Overcommit ratio</div>
            <hr className="ram-popover__separator" />
            <div className="ram-popover__value" data-test="total">
              {`${totalMemory.value} ${totalMemory.unit}`}
            </div>
            <div>Total</div>
          </div>
        </>
      }
    >
      {children}
    </Popover>
  );
};

RAMPopover.propTypes = {
  assigned: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  physical: PropTypes.number.isRequired,
  overcommit: PropTypes.number.isRequired,
};

export default RAMPopover;
