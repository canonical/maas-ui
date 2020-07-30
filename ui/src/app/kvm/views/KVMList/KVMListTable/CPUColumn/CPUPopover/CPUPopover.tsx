import PropTypes from "prop-types";
import React from "react";

import Popover from "app/base/components/Popover";

type Props = {
  assigned: number;
  children: JSX.Element | string;
  physical: number;
  overcommit: number;
};

const CPUPopover = ({
  assigned,
  children,
  physical,
  overcommit,
}: Props): JSX.Element => {
  const total = physical * overcommit;
  const unassigned = total - assigned;

  return (
    <Popover
      className="cpu-popover"
      content={
        <>
          <div className="cpu-popover__primary">
            <div className="cpu-popover__value" data-test="assigned">
              <i className="p-icon--assigned is-inline"></i>
              {assigned}
            </div>
            <div>Assigned</div>
            <div className="cpu-popover__value" data-test="unassigned">
              <i className="p-icon--unassigned is-inline"></i>
              {unassigned}
            </div>
            <div>Unassigned</div>
          </div>
          <div className="cpu-popover__secondary">
            <div className="cpu-popover__value" data-test="physical">
              {physical}
            </div>
            <div>{`Physical core${physical === 1 ? "" : "s"}`}</div>
            <div className="cpu-popover__value">
              &times;&nbsp;&nbsp;
              <span data-test="overcommit">{overcommit}</span>
            </div>
            <div>Overcommit ratio</div>
            <hr className="cpu-popover__separator" />
            <div className="cpu-popover__value" data-test="total">
              {total}
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

CPUPopover.propTypes = {
  assigned: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  physical: PropTypes.number.isRequired,
  overcommit: PropTypes.number.isRequired,
};

export default CPUPopover;
