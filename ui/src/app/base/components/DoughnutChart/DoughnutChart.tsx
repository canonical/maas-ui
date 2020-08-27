import { nanoid } from "@reduxjs/toolkit";
import React, { useRef, useEffect, useState } from "react";

type Segment = {
  /**
   * The colour of the segment.
   */
  color: string;
  /**
   * The segment tooltip.
   */
  tooltip?: string;
  /**
   * The segment length.
   */
  value: number;
};

type Props = {
  /**
   * The label in the centre of the doughnut.
   */
  label?: string;
  /**
   * The width of the segments when hovered.
   */
  segmentHoverWidth: number;
  /**
   * The width of the segments.
   */
  segmentWidth: number;
  /**
   * The doughnut segments.
   */
  segments: Segment[];
  /**
   * The size of the doughnut.
   */
  size: number;
};

export const DoughnutChart = ({
  label,
  segmentHoverWidth,
  segmentWidth,
  segments,
  size,
}: Props): JSX.Element => {
  const [showTooltip, setShowTooltip] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState(null);
  const removeListener = useRef<() => void>(null);

  useEffect(
    () => () => {
      // Unattach the mouse move listener if the component gets unmounted while
      // showing the tooltip.
      if (removeListener.current) {
        removeListener.current();
      }
    },
    []
  );

  const id = `doughnut-chart-${nanoid()}`;
  // The canvas needs enough space so that the hover state does not get cut off.
  const canvasSize = size + segmentHoverWidth - segmentWidth;
  const diameter = size - segmentWidth;
  const radius = diameter / 2;
  const circumference = Math.round(diameter * Math.PI);
  // Calculate the total value of all segments.
  const total = segments.reduce(
    (totalValue, segment) => (totalValue += segment.value),
    0
  );
  let accumulatedLength = 0;
  const segmentNodes = segments.map(({ color, tooltip, value }, i) => {
    // The start position is the value of all previous segments.
    const startPosition = accumulatedLength;
    // The length of the segment (as a portion of the doughnut circumference)
    const segmentLength = (value / total) * circumference;
    // The space left until the end of the circle.
    const remainingSpace = circumference - (segmentLength + startPosition);
    // Add this segment length to the running tally.
    accumulatedLength += segmentLength;
    return (
      <circle
        className="doughnut-chart__segment"
        cx={radius}
        cy={radius}
        key={i}
        onMouseOver={
          tooltip
            ? (event) => {
                const { currentTarget } = event;
                const bounding = event.currentTarget.getBoundingClientRect();
                setShowTooltip(tooltip);
                const updatePosition = (x: number, y: number) => {
                  const html = document.querySelector("html");
                  const offsetTop = html.scrollTop;
                  const scrollLeft = html.scrollLeft;
                  // Set the position of the tooltip, accounting for the width of the
                  // segment and the page scroll.
                  setTooltipStyle({
                    // An additional space (10) is added to give some room from
                    // the cursor.
                    left: x - bounding.x + segmentWidth / 2 + 10 - scrollLeft,
                    top: y - bounding.y + segmentWidth / 2 - offsetTop,
                  });
                };
                // Set the initial position on mouse over.
                updatePosition(event.clientX, event.clientY);
                const mouseListener = (evt: MouseEvent) => {
                  // Move the tooltip as the mouse moves.
                  updatePosition(evt.pageX, evt.pageY);
                };
                currentTarget.addEventListener("mousemove", mouseListener);
                // Store the remove listener.
                removeListener.current = () => {
                  currentTarget.removeEventListener("mousemove", mouseListener);
                };
              }
            : null
        }
        onMouseOut={
          tooltip
            ? () => {
                // Hide the tooltip and clean up the mouse move listener.
                setShowTooltip(null);
                setTooltipStyle(null);
                removeListener.current();
              }
            : null
        }
        r={radius}
        style={{
          stroke: color,
          strokeWidth: segmentWidth,
          // The dash array used is:
          // 1 - We want there to be a space before the first visible dash so
          //     by setting this to 0 we can use the next dash for the space.
          // 2 - This gap is the distance of all previous segments
          //     so that the segment starts in the correct spot.
          // 3 - A dash that is the length of the segment.
          // 4 - A gap from the end of the segment to the start of the circle
          //     so that the dash array doesn't repeat and be visible.
          strokeDasharray: `0 ${startPosition.toFixed(
            2
          )} ${segmentLength.toFixed(2)} ${remainingSpace.toFixed(2)}`,
        }}
        // Rotate the segment so that the segments start at the top of
        // the chart.
        transform={`rotate(-90 ${radius},${radius})`}
      />
    );
  });
  return (
    <div className="p-tooltip--right">
      <style>
        {/* Set the hover width of the segments. */}
        {`#${id} .doughnut-chart__segment:hover {
          stroke-width: ${segmentHoverWidth} !important;
        }`}
      </style>
      <svg
        width={canvasSize}
        height={canvasSize}
        className="doughnut-chart"
        id={id}
      >
        {/* Move the chart on the canvas to leave enough space so that the hovered segments don't get cut off. */}
        <g
          transform={`translate(${segmentHoverWidth / 2}, ${
            segmentHoverWidth / 2
          })`}
        >
          {segmentNodes}
          {label ? (
            <text x={radius} y={radius}>
              <tspan className="doughnut-chart__label">{label}</tspan>
            </text>
          ) : null}
        </g>
      </svg>
      {showTooltip ? (
        <div className="doughnut-chart__tooltip" style={tooltipStyle}>
          <span className="p-tooltip__message" role="tooltip">
            {showTooltip}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default DoughnutChart;
