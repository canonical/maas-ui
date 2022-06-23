import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";

import { useListener } from "@canonical/react-components/dist/hooks";
import classNames from "classnames";

import { COLOURS } from "app/base/constants";

export const DEFAULT_FILLED_COLORS = [
  COLOURS.LINK,
  COLOURS.POSITIVE,
  COLOURS.NEGATIVE,
  COLOURS.CAUTION,
];
export const DEFAULT_EMPTY_COLOR = COLOURS.LINK_FADED;
export const DEFAULT_OVER_COLOR = COLOURS.CAUTION;
export const DEFAULT_SEPARATOR_COLOR = COLOURS.LIGHT;
const MINIMUM_SEGMENT_WIDTH = 2;
const SEPARATOR_WIDTH = 1;

const updateWidths = (
  el: React.MutableRefObject<Element | null>,
  maximum: number,
  setSegmentWidth: (size: number) => void
) => {
  const boundingWidth = el?.current?.getBoundingClientRect()?.width || 0;
  const segmentWidth =
    boundingWidth > maximum * MINIMUM_SEGMENT_WIDTH
      ? boundingWidth / maximum
      : MINIMUM_SEGMENT_WIDTH;
  setSegmentWidth(segmentWidth);
};

type MeterDatum = {
  color?: string;
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

export enum TestIds {
  Bar = "meter-bar",
  Container = "meter-container",
  Filled = "meter-filled",
  Label = "meter-label",
  MeterOverflow = "meter-overflow",
  Segments = "meter-segments",
}

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

  useEffect(() => {
    if (segmented) {
      updateWidths(el, maximum, setSegmentWidth);
    }
  }, [maximum, segmented]);

  const onResize = useCallback(() => {
    updateWidths(el, maximum, setSegmentWidth);
  }, [el, maximum, setSegmentWidth]);

  useListener(window, onResize, "resize", true, segmented);

  return (
    <div
      className={classNames(small ? "p-meter--small" : "p-meter", className)}
      data-testid={TestIds.Container}
      ref={el}
    >
      <div
        className="p-meter__bar"
        data-testid={TestIds.Bar}
        style={{ backgroundColor: emptyColor }}
      >
        {valueSum > maximum ? (
          <div
            className="p-meter__filled"
            data-testid={TestIds.MeterOverflow}
            style={{
              backgroundColor: overColor,
              width: "100%",
            }}
          ></div>
        ) : (
          data.map((datum, i) => (
            <div
              className="p-meter__filled"
              data-testid={TestIds.Filled}
              key={`meter-${i}`}
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
            data-testid={TestIds.Segments}
            style={{
              background: `repeating-linear-gradient(
                to right,
                transparent 0,
                transparent ${segmentWidth - SEPARATOR_WIDTH}px,
                ${separatorColor} ${segmentWidth - SEPARATOR_WIDTH}px,
                ${separatorColor} ${segmentWidth}px
              )`,
            }}
          />
        )}
      </div>
      {label && (
        <div
          className={classNames("p-meter__label", labelClassName)}
          data-testid={TestIds.Label}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default Meter;
