import type { ReactNode } from "react";

import { Field } from "@canonical/react-components";
import classNames from "classnames";

import type { SwitchProps } from "../Switch";
import Switch from "../Switch";

export type Props = SwitchProps & {
  readonly caution?: string;
  readonly className?: string;
  readonly error?: string;
  readonly help?: string;
  readonly id?: string;
  readonly label?: ReactNode;
  readonly labelClassName?: string;
  readonly required?: boolean;
  readonly stacked?: boolean;
  readonly success?: string;
  readonly type?: string;
  readonly wrapperClassName?: string;
};

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
}: Props): React.ReactElement => {
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

export default SwitchField;
