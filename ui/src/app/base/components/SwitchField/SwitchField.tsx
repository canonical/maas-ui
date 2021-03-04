import type { HTMLProps, ReactNode } from "react";

import { Field } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";

import Switch from "../Switch";

export type Props = {
  caution?: string;
  className?: string;
  error?: string;
  help?: string;
  id?: string;
  label?: ReactNode;
  labelClassName?: string;
  required?: boolean;
  stacked?: boolean;
  success?: string;
  type?: string;
  wrapperClassName?: string;
} & HTMLProps<HTMLInputElement>;

const SwitchField = ({
  caution,
  className,
  error,
  help,
  id,
  label,
  labelClassName,
  required,
  stacked,
  success,
  wrapperClassName,
  ...props
}: Props): JSX.Element => {
  return (
    <Field
      caution={caution}
      className={wrapperClassName}
      error={error}
      forId={id}
      help={help}
      label={label}
      labelClassName={labelClassName}
      required={required}
      stacked={stacked}
      success={success}
    >
      <Switch
        className={classNames("p-form-validation__input", className)}
        id={id}
        {...props}
      />
    </Field>
  );
};

SwitchField.propTypes = {
  caution: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.node,
  help: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
  stacked: PropTypes.bool,
  success: PropTypes.node,
  wrapperClassName: PropTypes.string,
};

export default SwitchField;
