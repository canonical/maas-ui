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
        <div>{`${total}${unit}`}</div>
      </div>
      <div className="u-align--right">
        <p className="p-heading--small u-text--light">
          Allocated
          <span className="u-nudge-left--small">
            <i className="p-icon--allocated"></i>
          </span>
        </p>
        <div className="u-nudge-left">{`${allocated}${unit}`}</div>
      </div>
      <div className="u-align--right">
        <p className="p-heading--small u-text--light">
          Free
          <span className="u-nudge-left--small">
            <i className="p-icon--free"></i>
          </span>
        </p>
        <div className="u-nudge-left">{`${free}${unit}`}</div>
      </div>
      <div style={{ gridArea: "meter" }}>
        <Meter
          className="u-no-margin--bottom"
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
