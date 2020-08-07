import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

type Props = {
  className?: string;
  // TODO: Investigate why this won't work with React.HTMLProps<HTMLInputElement>.
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const Switch = ({ className, ...inputProps }: Props): JSX.Element => {
  return (
    <span>
      <input
        className={classNames("p-switch", className)}
        type="checkbox"
        {...inputProps}
      />
      <div className="p-switch__slider"></div>
    </span>
  );
};

Switch.propTypes = {
  /**
   * Optional classes applied to the parent element.
   */
  className: PropTypes.string,
};

export default Switch;
