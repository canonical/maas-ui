import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Label from "../Label";

const generateHelp = help => help && <p className="p-form-help-text">{help}</p>;

const generateError = (error, caution, success) => {
  if (!error && !caution && !success) {
    return;
  }
  let messageType =
    (error && "Error") || (caution && "Caution") || (success && "Success");
  return (
    <p className="p-form-validation__message">
      <strong>{messageType}:</strong> {error || caution || success}
    </p>
  );
};

const generateLabel = (forId, required, label, stacked) => {
  if (!label) {
    return;
  }
  const labelNode = (
    <Label forId={forId} required={required}>
      {label}
    </Label>
  );
  if (stacked) {
    return <div className="col-4">{labelNode}</div>;
  }
  return labelNode;
};

const generateContent = (
  isSelect,
  children,
  labelFirst,
  labelNode,
  help,
  error,
  caution,
  success
) => (
  <div className="p-form__control u-clearfix">
    {isSelect ? (
      <div className="p-form-validation__select-wrapper">{children}</div>
    ) : (
      children
    )}
    {!labelFirst && labelNode}
    {generateHelp(help)}
    {generateError(error, caution, success)}
  </div>
);

const Field = ({
  caution,
  children,
  className,
  error,
  forId,
  help,
  isSelect,
  label,
  labelFirst,
  required,
  stacked,
  success,
  type,
  ...props
}) => {
  const labelNode = generateLabel(forId, required, label, stacked);
  const content = generateContent(
    isSelect,
    children,
    (labelFirst = true),
    labelNode,
    help,
    error,
    caution,
    success
  );
  return (
    <div
      className={classNames("p-form__group", "p-form-validation", className, {
        "is-error": error,
        "is-caution": caution,
        "is-success": success,
        row: stacked
      })}
    >
      {labelFirst && labelNode}
      {stacked ? <div className="col-8">{content}</div> : content}
    </div>
  );
};

Field.propTypes = {
  caution: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.string,
  forId: PropTypes.string,
  help: PropTypes.string,
  isSelect: PropTypes.bool,
  label: PropTypes.string,
  labelFirst: PropTypes.bool,
  required: PropTypes.bool,
  stacked: PropTypes.bool,
  success: PropTypes.string
};

export default Field;
