import PropTypes from "prop-types";
import React from "react";

import Input from "../Input";

const FormikField = ({
  component: Component = Input,
  fieldKey,
  formikProps,
  ...props
}) => (
  <Component
    error={formikProps.touched[fieldKey] && formikProps.errors[fieldKey]}
    help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
    id="username"
    label="Username"
    onBlur={formikProps.handleBlur}
    onChange={formikProps.handleChange}
    required={true}
    type="text"
    value={formikProps.values[fieldKey]}
    {...props}
  />
);

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
