import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import { useOnWindowResize } from "app/base/hooks";

export const DEFAULT_FILLED_COLORS = [
  "#0066CC",
  "#0E8420",
  "#C7162B",
  "#F99B11",
];
export const DEFAULT_EMPTY_COLOR = "#D3E4ED";
export const DEFAULT_OVER_COLOR = "#F99B11";
export const DEFAULT_SEPARATOR_COLOR = "#F7F7F7";

const updateWidths = (
  el: React.MutableRefObject<Element | null>,
  maximum: number,
  setBarWidth: (size: number) => void,
  setSegmentWidth: (size: number) => void
) => {
  const boundingWidth = el?.current?.getBoundingClientRect()?.width || 0;
  // Because we're dealing with single pixel separators, we set the bar width to
  // the nearest floor base 2 number to help with anti-aliasing.
  const base2Width = Math.pow(
    2,
    Math.floor(Math.log(boundingWidth) / Math.log(2))
  );
  const segmentWidth = base2Width > maximum * 2 ? base2Width / maximum : 2;
  setBarWidth(base2Width);
  setSegmentWidth(segmentWidth);
};

type MeterDatum = {
  color?: string;
  key: string;
  value: number;
};

type Props = {
  className?: string;
  data: MeterDatum[];
  emptyColor?: string;
  label?: string | JSX.Element;
  labelClassName?: string;
  max?: number;
  overColor?: string;
  segmented?: boolean;
  separatorColor?: string;
  small?: boolean;
};

const Meter = ({
  className,
  data,
  emptyColor = DEFAULT_EMPTY_COLOR,
  label,
  labelClassName,
  max,
  overColor = DEFAULT_OVER_COLOR,
  segmented = false,
  separatorColor = DEFAULT_SEPARATOR_COLOR,
  small = false,
}: Props): JSX.Element => {
  const el = useRef(null);
  const valueSum = data.reduce((sum, datum) => sum + datum.value, 0);
  const maximum = max || valueSum;
  const datumWidths = data.map((datum) => (datum.value / maximum) * 100);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (segmented) {
      updateWidths(el, maximum, setBarWidth, setSegmentWidth);
    }
  }, [maximum, segmented]);

  useOnWindowResize(() => {
    if (segmented) {
      updateWidths(el, maximum, setBarWidth, setSegmentWidth);
    }
  });

  return (
    <div
      className={classNames(small ? "p-meter--small" : "p-meter", className)}
      ref={el}
    >
      <div
        className="p-meter__bar"
        style={{ backgroundColor: emptyColor, width: barWidth || undefined }}
      >
        {valueSum > maximum ? (
          <div
            className="p-meter__filled"
            style={{
              backgroundColor: overColor,
              width: "100%",
            }}
          ></div>
        ) : (
          data.map((datum, i) => (
            <div
              className="p-meter__filled"
              key={`${datum.key}-bar`}
              style={{
                backgroundColor:
                  datum.color ||
                  DEFAULT_FILLED_COLORS[i % DEFAULT_FILLED_COLORS.length],
                borderRight:
                  i + 1 < data.length
                    ? `1px solid ${separatorColor}`
                    : undefined,
                left: `${datumWidths.reduce(
                  (leftPos, width, j) => (i > j ? leftPos + width : leftPos),
                  0
                )}%`,
                width: `${datumWidths[i]}%`,
              }}
            ></div>
          ))
        )}
        {segmentWidth > 0 && (
          <div
            className="p-meter__separators"
            style={{
              background: `repeating-linear-gradient(
                to right,
                transparent 0,
                transparent ${segmentWidth - 1}px,
                ${separatorColor} ${segmentWidth - 1}px,
                ${separatorColor} ${segmentWidth}px
              )`,
            }}
          />
        )}
      </div>
      {label && (
        <div className={classNames("p-meter__label", labelClassName)}>
          {label}
        </div>
      )}
    </div>
  );
};

Meter.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      key: PropTypes.string.isRequired,
      value: PropTypes.number,
    })
  ).isRequired,
  emptyColor: PropTypes.string,
  label: PropTypes.node,
  labelClassName: PropTypes.string,
  max: PropTypes.number,
  overColor: PropTypes.string,
  segmented: PropTypes.bool,
  separatorColor: PropTypes.string,
  small: PropTypes.bool,
};

export default Meter;
