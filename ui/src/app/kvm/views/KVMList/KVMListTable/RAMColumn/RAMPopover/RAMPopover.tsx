import PropTypes from "prop-types";
import React from "react";

import { formatBytes } from "app/utils";
import Popover from "app/base/components/Popover";

type Props = {
  allocated: number;
  children: JSX.Element | string;
  physical: number;
  overcommit: number;
};

const RAMPopover = ({
  allocated,
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
  const allocatedMemory = formatBytes(allocated, "MiB", {
    binary: true,
  });
  const freeMemory = formatBytes(physical * overcommit - allocated, "MiB", {
    binary: true,
  });

  return (
    <Popover
      className="ram-popover"
      content={
        <>
          <div className="ram-popover__header p-table__header">RAM</div>
          <div className="ram-popover__primary">
            <div className="u-align--right" data-test="allocated">
              {`${allocatedMemory.value} ${allocatedMemory.unit}`}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link"></i>
            </div>
            <div>Allocated</div>
            <div className="u-align--right" data-test="free">
              {`${freeMemory.value} ${freeMemory.unit}`}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link-faded"></i>
            </div>
            <div>Free</div>
          </div>
          <div className="ram-popover__secondary">
            <div className="u-align--right" data-test="physical">
              {`${physicalMemory.value} ${physicalMemory.unit}`}
            </div>
            <div />
            <div>Physical RAM</div>
            <div className="u-align--right">
              &times;&nbsp;
              <span data-test="overcommit">{overcommit}</span>
            </div>
            <div />
            <div>Overcommit ratio</div>
            <hr className="ram-popover__separator" />
            <div className="u-align--right" data-test="total">
              {`${totalMemory.value} ${totalMemory.unit}`}
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

RAMPopover.propTypes = {
  allocated: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  physical: PropTypes.number.isRequired,
  overcommit: PropTypes.number.isRequired,
};

export default RAMPopover;
