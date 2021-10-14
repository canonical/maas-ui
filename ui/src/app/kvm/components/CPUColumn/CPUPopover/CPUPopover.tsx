import type { ReactNode } from "react";

import Popover from "app/base/components/Popover";
import type { KVMResource } from "app/kvm/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  children: ReactNode;
  cores: KVMResource;
  overCommit?: number;
};

const CPUPopover = ({ children, cores, overCommit }: Props): JSX.Element => {
  let total = 0;
  let allocated = 0;
  let other = 0;
  let free = 0;
  let hostCores = 0;
  let showOther = false;
  let hasOverCommit = false;
  if (overCommit && "allocated_other" in cores) {
    const overCommitted = resourceWithOverCommit(cores, overCommit);
    hostCores = cores.allocated_other + cores.allocated_tracked + cores.free;
    total =
      overCommitted.allocated_other +
      overCommitted.allocated_tracked +
      overCommitted.free;
    showOther = cores.allocated_other > 0;
    other = cores.allocated_other;
    allocated = cores.allocated_tracked;
    free = cores.free;
    hasOverCommit = overCommit !== 1;
  } else if ("total" in cores) {
    total = cores.total;
    allocated = cores.total - cores.free;
    free = cores.free;
  }

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
            <div data-test="allocated-label">
              {showOther ? "Project" : "Allocated"}
            </div>
            {showOther && (
              <>
                <div className="u-align--right" data-test="other">
                  {other}
                </div>
                <div className="u-vertically-center">
                  <i className="p-circle--positive"></i>
                </div>
                <div>Others</div>
              </>
            )}
            <div className="u-align--right" data-test="free">
              {free}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link-faded"></i>
            </div>
            <div>Free</div>
          </div>
          <div className="cpu-popover__secondary">
            {hasOverCommit && (
              <>
                <div className="u-align--right" data-test="host">
                  {hostCores}
                </div>
                <div />
                <div>{`Host core${hostCores === 1 ? "" : "s"}`}</div>
                <div className="u-align--right">
                  &times;&nbsp;
                  <span data-test="overcommit">{overCommit}</span>
                </div>
                <div />
                <div>Overcommit ratio</div>
                <hr className="cpu-popover__separator" />
              </>
            )}
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

export default CPUPopover;
