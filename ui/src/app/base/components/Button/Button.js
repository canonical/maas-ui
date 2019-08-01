import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const Button = ({
  appearance = "neutral",
  children,
  className,
  disabled,
  element = "button",
  hasIcon,
  inline,
  ...props
}) => {
  const classes = classNames(className, `p-button--${appearance}`, {
    "has-icon": hasIcon,
    "is-disabled": (element === "a") & disabled,
    "is-inline": inline
  });
  if (element === "button") {
    return (
      <button className={classes} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
  return (
    <a className={classes} aria-disabled={disabled} {...props}>
      {children}
    </a>
  );
};

Button.propTypes = {
  appearance: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  element: PropTypes.oneOf(["button", "a"]),
  hasIcon: PropTypes.bool,
  inline: PropTypes.bool
};

export default Button;
