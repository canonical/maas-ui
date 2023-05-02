/* eslint-disable react/no-multi-comp */
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";

import { useListener } from "@canonical/react-components";
import classNames from "classnames";

export const color = {
  caution: "#F99B11",
  light: "#F7F7F7",
  linkFaded: "#D3E4ED",
  link: "#0066CC",
  negative: "#C7162B",
  positiveFaded: "#B7CCB9",
  positiveMid: "#4DAB4D",
  positive: "#0E8420",
} as const;

export const defaultFilledColors = [
  color.link,
  color.positive,
  color.negative,
  color.caution,
];
export const defaultEmptyColor = color.linkFaded;
export const defaultOverColor = color.caution;
export const defaultSeparatorColor = color.light;
const minimumSegmentWidth = 2;
const separatorWidth = 1;

const calculateWidths = (
  el: React.MutableRefObject<Element | null>,
  maximum: number,
  setSegmentWidth: (size: number) => void
) => {
  const boundingWidth = el?.current?.getBoundingClientRect()?.width || 0;
  const segmentWidth =
    boundingWidth > maximum * minimumSegmentWidth
      ? boundingWidth / maximum
      : minimumSegmentWidth;
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

export const testIds = {
  bar: "meter-bar",
  container: "meter-container",
  filled: "meter-filled",
  label: "meter-label",
  meteroverflow: "meter-overflow",
  segments: "meter-segments",
};

const MeterSegment = ({
  data,
  datumWidths,
  maximum,
  overColor,
  segmentWidth,
  separatorColor,
}: Props & {
  datumWidths: number[];
  maximum: number;
  segmentWidth: number;
}) => {
  const isOverflowing = () =>
    data.reduce((sum, datum) => sum + datum.value, 0) > maximum;

  const filledStyle = (datum: MeterDatum, i: number) => ({
    backgroundColor: datum.color,
    left: `${datumWidths.reduce(
      (leftPos, width, j) => (i > j ? leftPos + width : leftPos),
      0
    )}%`,
    width: `${datumWidths[i]}%`,
  });

  const separatorStyle = () => ({
    background: `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${segmentWidth - separatorWidth}px,
      ${separatorColor} ${segmentWidth - separatorWidth}px,
      ${separatorColor} ${segmentWidth}px
    )`,
  });

  return (
    <>
      {isOverflowing() ? (
        <div
          className="p-meter__filled"
          data-testid={testIds.meteroverflow}
          style={{ backgroundColor: overColor, width: "100%" }}
        ></div>
      ) : (
        data.map((datum, i) => (
          <div
            className="p-meter__filled"
            data-testid={testIds.filled}
            key={`meter-${i}`}
            style={filledStyle(datum, i)}
          ></div>
        ))
      )}
      {segmentWidth > 0 && (
        <div
          className="p-meter__separators"
          data-testid={testIds.segments}
          style={separatorStyle()}
        />
      )}
    </>
  );
};

const MeterLabel = ({
  labelClassName,
  label,
}: Pick<Props, "labelClassName" | "label">) => {
  return (
    <div
      className={classNames("p-meter__label", labelClassName)}
      data-testid={testIds.label}
    >
      {label}
    </div>
  );
};

const Meter = ({
  className,
  data,
  emptyColor = defaultEmptyColor,
  label,
  labelClassName,
  max,
  overColor = defaultOverColor,
  segmented = false,
  separatorColor = defaultSeparatorColor,
  small = false,
}: Props): JSX.Element => {
  const el = useRef(null);
  const valueSum = data.reduce((sum, datum) => sum + datum.value, 0);
  const maximum = max || valueSum;
  const datumWidths = data.map((datum) => (datum.value / maximum) * 100);
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    if (segmented) {
      calculateWidths(el, maximum, setSegmentWidth);
    }
  }, [maximum, segmented]);

  const onResize = useCallback(() => {
    calculateWidths(el, maximum, setSegmentWidth);
  }, [el, maximum, setSegmentWidth]);

  useListener(window, onResize, "resize", true, segmented);

  return (
    <div
      className={classNames(small ? "p-meter--small" : "p-meter", className)}
      data-testid={testIds.container}
      ref={el}
    >
      <div
        className="p-meter__bar"
        data-testid={testIds.bar}
        style={{ backgroundColor: emptyColor }}
      >
        <MeterSegment
          data={data}
          datumWidths={datumWidths}
          maximum={maximum}
          overColor={overColor}
          segmentWidth={segmentWidth}
          separatorColor={separatorColor}
        />
      </div>
      {label && <MeterLabel label={label} labelClassName={labelClassName} />}
    </div>
  );
};

export default Meter;
