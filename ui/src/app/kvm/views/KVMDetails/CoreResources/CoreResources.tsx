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
  const pinnedRanges = getRanges(pinned).join(", ");
  const availableRanges = getRanges(available).join(", ");
  const showPinnedSection = available.length + pinned.length > 0;
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
        {showPinnedSection && (
          <div data-test="pinned-section">
            <hr />
            <h4 className="core-resources__header p-heading--small u-sv1">
              Pinned cores
            </h4>
            <div>{pinned ? pinnedRanges : <em>None</em>}</div>
            <span className="p-text--paragraph u-text--light">
              {available
                ? `(Unpinned cores: ${availableRanges})`
                : "All cores are pinned."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreResources;
