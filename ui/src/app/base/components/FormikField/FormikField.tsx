import { Input } from "@canonical/react-components";
import { useField } from "formik";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";

import type { TSFixMe } from "app/base/types";

type Props = {
  Component?: JSX.Element;
  name: string;
  value?: number | string;
  [x: string]: TSFixMe;
};

const FormikField = ({
  component: Component = Input,
  name,
  value,
  ...props
}: Props): JSX.Element => {
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
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default FormikField;
