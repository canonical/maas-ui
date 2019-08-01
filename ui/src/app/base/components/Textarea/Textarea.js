import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Field from "../Field";

const Textarea = ({
  caution,
  className,
  error,
  help,
  id,
  label,
  required,
  stacked,
  success,
  ...props
}) => {
  return (
    <Field
      caution={caution}
      error={error}
      forId={id}
      help={help}
      label={label}
      required={required}
      stacked={stacked}
      success={success}
    >
      <textarea
        className={classNames("p-form-validation__input", className)}
        id={id}
        {...props}
      />
    </Field>
  );
};

Textarea.propTypes = {
  caution: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  help: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  stacked: PropTypes.bool,
  success: PropTypes.string
};

export default Textarea;
