import { Input } from "@canonical/react-components";
import { useField } from "formik";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import uuidv4 from "uuid/v4";

const FormikField = ({ component: Component = Input, name, ...props }) => {
  const id = useRef(uuidv4());
  const [field, meta] = useField(name);
  return (
    <Component
      error={meta.touched ? meta.error : null}
      id={id.current}
      checked={
        ["checkbox", "radio"].includes(props.type) ? meta.value : undefined
      }
      {...field}
      {...props}
    />
  );
};

FormikField.propTypes = {
  component: PropTypes.func,
  name: PropTypes.string.isRequired
};

export default FormikField;
