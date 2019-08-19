import PropTypes from "prop-types";
import React, { useRef } from "react";
import uuidv4 from "uuid/v4";

import Input from "../Input";

const FormikField = ({
  component: Component = Input,
  fieldKey,
  formikProps,
  value = formikProps.values[fieldKey],
  ...props
}) => {
  const id = useRef(uuidv4());
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldTouched,
    status = {},
    touched
  } = formikProps;
  const { serverErrors = {}, invalidValues = {} } = status;
  return (
    <Component
      error={
        (touched[fieldKey] &&
          (errors[fieldKey] ||
            (value === invalidValues[fieldKey] && serverErrors[fieldKey]))) ||
        undefined
      }
      id={id.current}
      name={fieldKey}
      onBlur={handleBlur}
      onChange={e => {
        handleChange(e);
        setFieldTouched(fieldKey, true, true);
      }}
      value={value}
      {...props}
    />
  );
};

FormikField.propTypes = {
  component: PropTypes.func,
  fieldKey: PropTypes.string.isRequired,
  formikProps: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
  })
};

export default FormikField;
