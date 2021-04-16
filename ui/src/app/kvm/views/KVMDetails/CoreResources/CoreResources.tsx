import classNames from "classnames";

import PodMeter from "app/kvm/components/PodMeter";
import { getRanges } from "app/utils";

export type Props = {
  cores: {
    allocated: number;
    free: number;
  };
  dynamicLayout?: boolean;
  pinned?: number[];
  available?: number[];
};

const CoreResources = ({
  cores,
  dynamicLayout,
  pinned = [],
  available = [],
}: Props): JSX.Element => {
  const noPin = (pinned && pinned.length === 0) || 0;
  const pinnedRanges = getRanges(pinned).join(",");
  const noAvailable = (available && available.length === 0) || 0;
  const availableRanges = getRanges(available).join(",");
  return (
    <div
      className={classNames("core-resources", {
        "core-resources--dynamic-layout": dynamicLayout,
      })}
    >
      <h4 className="core-resources__header p-heading--small u-sv1">
        CPU cores
      </h4>
      <div className="core-resources__meter">
        <PodMeter allocated={cores.allocated} free={cores.free} segmented />
      </div>
      <div>
        {noPin && noAvailable ? (
          " "
        ) : (
          <div>
            <hr />
            <h4 className="core-resources__header p-heading--small u-sv1">
              Pinned cores
            </h4>
            <div>{noPin ? <em>None</em> : pinnedRanges}</div>
            <span className="p-text--paragraph u-text--light">
              {noAvailable
                ? "All cores are pinned."
                : `(Unpinned cores: ${availableRanges})`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreResources;
