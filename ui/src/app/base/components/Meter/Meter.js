import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const DEFAULT_COLORS = ["#007AA6", "#0E8420", "#C7162B", "#F99B11"];

const colorValidator = (props, propName, componentName) => {
  if (props[propName] && !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(props[propName])) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Must be a valid color code.`
    );
  }
};

const Meter = ({
  className,
  data,
  emptyColor = "#D3E4ED",
  labelsClassName,
  max,
  overColor = "#F99B11",
  small = false,
}) => {
  const hasLabels = data.some((datum) => datum.label);
  const valueSum = data.reduce((sum, datum) => sum + datum.value, 0);
  const maximum = max || valueSum;
  const widths = data.map((datum) => (datum.value / maximum) * 100);

  return (
    <div
      className={classNames(small ? "p-meter--small" : "p-meter", className)}
    >
      <div className="p-meter__bar" style={{ backgroundColor: emptyColor }}>
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
                  datum.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
                borderRight: `1px solid ${emptyColor}`,
                left: `${widths.reduce(
                  (leftPos, width, j) => (i > j ? leftPos + width : leftPos),
                  0
                )}%`,
                width: `${widths[i]}%`,
              }}
            ></div>
          ))
        )}
      </div>
      {hasLabels && (
        <div className={classNames("p-meter__labels", labelsClassName)}>
          {data.map((datum) => {
            if (!datum.label) {
              return null;
            }
            return (
              <div key={`${datum.key}-label`}>
                {small ? (
                  <small className="u-text--light">{datum.label}</small>
                ) : (
                  datum.label
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Meter.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: colorValidator,
      key: PropTypes.string.isRequired,
      label: PropTypes.node,
      value: PropTypes.number,
    })
  ).isRequired,
  emptyColor: colorValidator,
  labelsClassName: PropTypes.string,
  max: PropTypes.number,
  overColor: colorValidator,
  small: PropTypes.bool,
};

export default Meter;
