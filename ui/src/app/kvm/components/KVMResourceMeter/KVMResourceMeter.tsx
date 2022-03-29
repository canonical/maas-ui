import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import { formatBytes } from "app/utils";

type Props = {
  allocated: number;
  binaryUnit?: boolean;
  detailed?: boolean;
  free: number;
  other?: number;
  segmented?: boolean;
  unit?: string | null;
};

const KVMResourceMeter = ({
  allocated,
  binaryUnit = false,
  detailed = false,
  free,
  other = 0,
  segmented = false,
  unit = null,
}: Props): JSX.Element | null => {
  const total = allocated + free + other;
  const { value: formattedTotal, unit: formattedUnit } = unit
    ? formatBytes(total, unit, { binary: binaryUnit, decimals: 1 })
    : { value: total, unit: "" };
  const formatResource = (resource: number) =>
    unit
      ? formatBytes(resource, unit, {
          binary: binaryUnit,
          convertTo: formattedUnit,
          decimals: 1,
        }).value
      : resource;
  const formattedAllocated = formatResource(allocated);
  const formattedFree = formatResource(free);
  const formattedOther = formatResource(other);

  return (
    <div className="kvm-resource-meter">
      {detailed && (
        <div className="u-flex--between" data-testid="kvm-resource-details">
          <div className="u-flex--grow u-nudge-left--small">
            <div className="p-text--x-small-capitalised u-text--muted u-sv-1">
              Allocated
              <span className="u-nudge-right--small">
                <i className="p-circle--link u-no-margin--top"></i>
              </span>
            </div>
            <span data-testid="kvm-resource-allocated">
              {`${formattedAllocated}${formattedUnit}`}
            </span>
          </div>
          {formattedOther > 0 && (
            <div className="u-flex--grow u-nudge-left--small">
              <div className="p-text--x-small-capitalised u-text--muted u-sv-1">
                Others
                <span className="u-nudge-right--small">
                  <i className="p-circle--positive u-no-margin--top"></i>
                </span>
              </div>
              <span data-testid="kvm-resource-other">
                {`${formattedOther}${formattedUnit}`}
              </span>
            </div>
          )}
          <div className="u-flex--no-shrink">
            <div className="p-text--x-small-capitalised u-text--muted u-align--right u-sv-1">
              Free
              <span className="u-nudge-right--small">
                <i className="p-circle--link-faded u-no-margin--top"></i>
              </span>
            </div>
            <span data-testid="kvm-resource-free">
              {`${formattedFree}${formattedUnit}`}
            </span>
          </div>
        </div>
      )}
      <Meter
        className="u-flex--column-align-end u-no-margin--bottom"
        data={[
          {
            color: COLOURS.LINK,
            value: allocated,
          },
          {
            color: COLOURS.POSITIVE,
            value: other,
          },
          {
            color: COLOURS.LINK_FADED,
            value: free > 0 ? free : 0,
          },
        ]}
        label={
          detailed ? (
            <div>
              <div className="p-text--x-small-capitalised u-text--muted u-sv-1">
                Total
              </div>
              <div className="u-align--left">{`${formattedTotal}${formattedUnit}`}</div>
            </div>
          ) : (
            <small
              className="u-text--muted u-no-margin--bottom"
              data-testid="kvm-resource-summary"
            >
              {`${formattedAllocated} of ${formattedTotal}${formattedUnit} allocated`}
            </small>
          )
        }
        labelClassName="u-align--right"
        max={total}
        segmented={segmented}
        small
      />
    </div>
  );
};

export default KVMResourceMeter;
