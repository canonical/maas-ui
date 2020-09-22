import React from "react";

import Meter from "app/base/components/Meter";

type Props = {
  allocated: number;
  free: number;
  segmented?: boolean;
  unit?: string;
};

const PodMeter = ({
  allocated,
  free,
  segmented = false,
  unit = "",
}: Props): JSX.Element | null => {
  const total = allocated + free;

  return (
    <div className="pod-meter">
      <div>
        <p className="p-heading--small u-text--light">Total</p>
        <div data-test="total">{`${total}${unit}`}</div>
      </div>
      <div className="u-align--right">
        <p className="p-heading--small u-text--light">
          Allocated
          <span className="u-nudge-right--small">
            <i className="p-circle--link u-no-margin--top"></i>
          </span>
        </p>
        <div
          className="u-nudge-left"
          data-test="allocated"
        >{`${allocated}${unit}`}</div>
      </div>
      <div className="u-align--right">
        <p className="p-heading--small u-text--light">
          Free
          <span className="u-nudge-right--small">
            <i className="p-circle--link-faded u-no-margin--top"></i>
          </span>
        </p>
        <div className="u-nudge-left" data-test="free">{`${free}${unit}`}</div>
      </div>
      <div style={{ gridArea: "meter" }}>
        <Meter
          data={[
            {
              value: allocated,
            },
          ]}
          max={total}
          segmented={segmented}
          small
        />
      </div>
    </div>
  );
};

export default PodMeter;
