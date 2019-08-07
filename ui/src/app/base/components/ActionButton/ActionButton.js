import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../Button";
import "./ActionButton.scss";

const generateButtonChildren = (children, appearance, loading, success) => {
  const iconClass = classNames({
    "p-icon--spinner u-animation--spin": loading,
    "is-light": appearance === "positive" || appearance === "negative",
    "p-icon--success":
      success && (appearance !== "positive" && appearance !== "negative"),
    "p-icon--success-positive": success && appearance === "positive",
    "p-icon--success-negative": success && appearance === "negative"
  });

  return loading || success ? <i className={iconClass} /> : children;
};

const ActionButton = ({
  appearance = "neutral",
  children,
  className,
  loading,
  success,
  width,
  ...props
}) => {
  const classes = classNames(className, `p-action-button`, {
    "is-loading": loading,
    "is-success": success
  });
  const buttonChildren = generateButtonChildren(
    children,
    appearance,
    loading,
    success
  );
  const style = width ? { width } : {};

  return (
    <Button
      appearance={appearance}
      className={classes}
      style={style}
      {...props}
    >
      {buttonChildren}
    </Button>
  );
};

ActionButton.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  success: PropTypes.bool
};

export default ActionButton;
