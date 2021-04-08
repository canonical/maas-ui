import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { PodResource } from "app/store/pod/types";

type Props = { cores: PodResource };

const OverallCores = ({ cores }: Props): JSX.Element => {
  const { allocated_other, allocated_tracked, free } = cores;
  const totalCores = allocated_tracked + allocated_other + free;
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
                value: free,
              },
            ]}
            segmented
            small
          />
        </div>
      </div>
      <div className="u-align--right">
        <h4 className="p-heading--small u-no-max-width u-text--muted">Total</h4>
        <div>{totalCores}</div>
      </div>
    </div>
  );
};

export default OverallCores;
