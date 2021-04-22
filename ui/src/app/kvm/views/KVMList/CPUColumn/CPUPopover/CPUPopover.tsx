import type { ReactNode } from "react";

import Popover from "app/base/components/Popover";
import type { Pod, PodResource } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  children: ReactNode;
  cores: PodResource;
  overCommit: Pod["cpu_over_commit_ratio"];
};

const CPUPopover = ({ children, cores, overCommit }: Props): JSX.Element => {
  const overCommitted = resourceWithOverCommit(cores, overCommit);
  const hostCores =
    cores.allocated_other + cores.allocated_tracked + cores.free;
  const overCommitCores =
    overCommitted.allocated_other +
    overCommitted.allocated_tracked +
    overCommitted.free;
  const showOther = cores.allocated_other > 0;
  const hasOverCommit = overCommit !== 1;

  return (
    <Popover
      className="cpu-popover"
      content={
        <>
          <div className="cpu-popover__header p-table__header">CPU cores</div>
          <div className="cpu-popover__primary">
            <div className="u-align--right" data-test="allocated">
              {overCommitted.allocated_tracked}
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
                  {overCommitted.allocated_other}
                </div>
                <div className="u-vertically-center">
                  <i className="p-circle--positive"></i>
                </div>
                <div>Others</div>
              </>
            )}
            <div className="u-align--right" data-test="free">
              {overCommitted.free}
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
              {overCommitCores}
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
