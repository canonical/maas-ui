import { Input } from "@canonical/react-components";
import { useField } from "formik";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";

const FormikField = ({
  component: Component = Input,
  name,
  value,
  ...props
}) => {
  const id = useRef(nanoid());
  const [field, meta] = useField({ name, type: props.type, value });
  return (
    <Component
      error={meta.touched ? meta.error : null}
      id={id.current}
      {...field}
      {...props}
    />
  );
};

FormikField.propTypes = {
  component: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default FormikField;
