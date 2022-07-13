import type { ReactNode } from "react";

import classNames from "classnames";

export type Props = {
  checked?: boolean;
  className?: string;
  color?: string;
  name?: string;
  label?: ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const ThemedRadioButton = ({
  className,
  color,
  label,
  name,
  value,
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label className={classNames(className, "generalForm__radio--themed")}>
      <input
        checked={value === color}
        className={`generalForm__radio radio--theme-${color}`}
        name={name}
        type="radio"
        {...inputProps}
        value={color}
      />
      {label}
    </label>
  );
};

export default ThemedRadioButton;
