import React from "react";

import Meter from "app/base/components/Meter";

type Props = {
  allocated: number;
  free: number;
  segmented?: boolean;
  total: number;
  unit?: string;
};

const KVMMeter = ({
  allocated,
  free,
  segmented = false,
  total,
  unit = "",
}: Props): JSX.Element | null => {
  return (
    <div className="kvm-meter">
      <div>
        <p className="p-heading--small u-text--light">Total</p>
        <div data-test="total">{`${total}${unit}`}</div>
      </div>
      <div className="u-align--right">
        <p className="p-heading--small u-text--light">
          Allocated
          <span className="u-nudge-left--small">
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
          <span className="u-nudge-left--small">
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

export default KVMMeter;
