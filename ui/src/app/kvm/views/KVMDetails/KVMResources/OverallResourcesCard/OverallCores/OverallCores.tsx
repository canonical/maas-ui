import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { Pod, PodResource } from "app/store/pod/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  cores: PodResource;
  overCommit: Pod["cpu_over_commit_ratio"];
};

const OverallCores = ({ cores, overCommit }: Props): JSX.Element => {
  const { allocated_other, allocated_tracked, free } = resourceWithOverCommit(
    cores,
    overCommit
  );
  const total = allocated_other + allocated_tracked + free;
  return (
    <div className="overall-cores">
      <h4 className="p-heading--small u-sv1">CPU cores</h4>
      <div className="overall-cores__meter">
        <div className="u-align--right">
          <p className="p-heading--small u-text--light">
            Project
            <span className="u-nudge-right--small">
              <i className="p-circle--positive u-no-margin--top"></i>
            </span>
          </p>
          <div className="u-nudge-left">{allocated_tracked}</div>
        </div>
        <div className="u-align--right">
          <p className="p-heading--small u-text--light">
            Others
            <span className="u-nudge-right--small">
              <i className="p-circle--link u-no-margin--top"></i>
            </span>
          </p>
          <div className="u-nudge-left">{allocated_other}</div>
        </div>
        <div className="u-align--right">
          <p className="p-heading--small u-text--light">
            Free
            <span className="u-nudge-right--small">
              <i className="p-circle--link-faded u-no-margin--top"></i>
            </span>
          </p>
          <div className="u-nudge-left" data-test="free">
            {free}
          </div>
        </div>
        <div style={{ gridArea: "meter" }}>
          <Meter
            data={[
              {
                color: COLOURS.POSITIVE,
                value: allocated_tracked,
              },
              {
                color: COLOURS.LINK,
                value: allocated_other,
              },
              {
                color: COLOURS.LINK_FADED,
                // A negative free value implies cores have been over-committed,
                // but we don't actually want to represent negative values in
                // the chart.
                value: free > 0 ? free : 0,
              },
            ]}
            max={total}
            segmented
            small
          />
        </div>
      </div>
      <div className="u-align--right">
        <h4 className="p-heading--small u-no-max-width u-text--muted">Total</h4>
        <div>{total}</div>
      </div>
    </div>
  );
};

export default OverallCores;
