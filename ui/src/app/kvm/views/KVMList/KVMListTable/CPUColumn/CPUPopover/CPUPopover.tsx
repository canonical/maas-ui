import PropTypes from "prop-types";
import React from "react";

import Popover from "app/base/components/Popover";

type Props = {
  allocated: number;
  children: JSX.Element | string;
  physical: number;
  overcommit: number;
};

const CPUPopover = ({
  allocated,
  children,
  physical,
  overcommit,
}: Props): JSX.Element => {
  const total = physical * overcommit;
  const free = total - allocated;

  return (
    <Popover
      className="cpu-popover"
      content={
        <>
          <div className="cpu-popover__header p-table__header">CPU cores</div>
          <div className="cpu-popover__primary">
            <div className="u-align--right" data-test="allocated">
              {allocated}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link"></i>
            </div>
            <div>Allocated</div>
            <div className="u-align--right" data-test="free">
              {free}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link-faded"></i>
            </div>
            <div>Free</div>
          </div>
          <div className="cpu-popover__secondary">
            <div className="u-align--right" data-test="physical">
              {physical}
            </div>
            <div />
            <div>{`Physical core${physical === 1 ? "" : "s"}`}</div>
            <div className="u-align--right">
              &times;&nbsp;
              <span data-test="overcommit">{overcommit}</span>
            </div>
            <div />
            <div>Overcommit ratio</div>
            <hr className="cpu-popover__separator" />
            <div className="u-align--right" data-test="total">
              {total}
            </div>
            <div />
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
  allocated: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  physical: PropTypes.number.isRequired,
  overcommit: PropTypes.number.isRequired,
};

export default CPUPopover;
