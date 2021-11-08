import classNames from "classnames";

import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import { getRanges } from "app/utils";

export type Props = {
  allocated: number | number[];
  dynamicLayout?: boolean;
  free: number | number[];
  other?: number;
};

const CoreResources = ({
  allocated,
  dynamicLayout,
  free,
  other,
}: Props): JSX.Element => {
  const allocatedIsArray = Array.isArray(allocated);
  const freeIsArray = Array.isArray(free);
  const showPinnedSection = allocatedIsArray && freeIsArray;

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
        <KVMResourceMeter
          allocated={allocatedIsArray ? allocated.length : allocated}
          detailed
          free={freeIsArray ? free.length : free}
          other={other}
          segmented
        />
      </div>
      {showPinnedSection && (
        <div data-test="pinned-section">
          <hr />
          <h4 className="core-resources__header p-heading--small u-sv1">
            Pinned cores
          </h4>
          <div>
            {allocated.length ? getRanges(allocated).join(", ") : <em>None</em>}
          </div>
          <span className="p-text--paragraph u-text--light">
            {free.length
              ? `(Unpinned cores: ${getRanges(free).join(", ")})`
              : "All cores are pinned."}
          </span>
        </div>
      )}
    </div>
  );
};

export default CoreResources;
