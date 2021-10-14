import type { ReactNode } from "react";

import Popover from "app/base/components/Popover";
import type { KVMResource } from "app/kvm/types";
import { memoryWithUnit } from "app/kvm/utils";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  children: ReactNode;
  memory: {
    hugepages: KVMResource;
    general: KVMResource;
  };
  overCommit?: number;
};

const RAMPopover = ({ children, memory, overCommit }: Props): JSX.Element => {
  const { general, hugepages } = memory;
  let total = 0;
  let allocated = 0;
  let other = 0;
  let free = 0;
  let hostTotal = 0;
  let showOther = false;
  let hasOverCommit = false;
  if (
    overCommit &&
    "allocated_other" in general &&
    "allocated_other" in hugepages
  ) {
    const hostGeneral =
      general.allocated_other + general.allocated_tracked + general.free;
    const hostHugepages =
      hugepages.allocated_other + hugepages.allocated_tracked + hugepages.free;
    hostTotal = hostGeneral + hostHugepages;
    const generalOver = resourceWithOverCommit(general, overCommit);
    allocated = generalOver.allocated_tracked + hugepages.allocated_tracked;
    other = generalOver.allocated_other + hugepages.allocated_other;
    free = generalOver.free + hugepages.free;
    total = allocated + other + free;
    showOther = general.allocated_other > 0 || hugepages.allocated_other > 0;
    hasOverCommit = overCommit !== 1;
  } else if ("total" in general && "total" in hugepages) {
    free = general.free + hugepages.free;
    total = general.total + hugepages.total;
    allocated = total - free;
  }

  return (
    <Popover
      className="ram-popover"
      content={
        <>
          <div className="ram-popover__header p-table__header">RAM</div>
          <div className="ram-popover__primary">
            <div className="u-align--right" data-test="allocated">
              {`${memoryWithUnit(allocated)}`}
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
                  {`${memoryWithUnit(other)}`}
                </div>
                <div className="u-vertically-center">
                  <i className="p-circle--positive"></i>
                </div>
                <div>Others</div>
              </>
            )}
            <div className="u-align--right" data-test="free">
              {`${memoryWithUnit(free)}`}
            </div>
            <div className="u-vertically-center">
              <i className="p-circle--link-faded"></i>
            </div>
            <div>Free</div>
          </div>
          <div className="ram-popover__secondary">
            {hasOverCommit && (
              <>
                <div className="u-align--right" data-test="host">
                  {`${memoryWithUnit(hostTotal)}`}
                </div>
                <div />
                <div>Host RAM</div>
                <div className="u-align--right">
                  &times;&nbsp;
                  <span data-test="overcommit">{overCommit}</span>
                </div>
                <div />
                <div>Overcommit ratio</div>
                <hr className="ram-popover__separator" />
              </>
            )}
            <div className="u-align--right" data-test="total">
              {`${memoryWithUnit(total)}`}
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

export default RAMPopover;
