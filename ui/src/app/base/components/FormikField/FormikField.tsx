import type {
  ComponentProps,
  ComponentType,
  ElementType,
  HTMLProps,
} from "react";

import { Input } from "@canonical/react-components";
import { useField } from "formik";

import { useId } from "app/base/hooks/base";

export type Props<C extends ElementType | ComponentType = typeof Input> = {
  component?: C;
  displayError?: boolean;
  name: string;
  value?: HTMLProps<HTMLElement>["value"];
} & ComponentProps<C>;

const FormikField = <C extends ElementType | ComponentType = typeof Input>({
  component: Component = Input,
  displayError = true,
  name,
  value,
  label,
  ...props
}: Props<C>): JSX.Element => {
  const id = useId();
  const [field, meta] = useField({ name, type: props.type, value });
  return (
    <Component
      error={meta.touched && displayError ? meta.error : null}
      id={id}
      aria-label={label}
      label={label}
      {...field}
      {...props}
    />
  );
};

export default FormikField;
