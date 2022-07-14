import type { ReactNode } from "react";

import classNames from "classnames";

export type Props = {
  checked?: boolean;
  className?: string;
  color?: ColorValues;
  name?: string;
  label?: ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

export enum ColorValues {
  Default = "default",
  Bark = "bark",
  Sage = "sage",
  Olive = "olive",
  Viridian = "viridian",
  PrussianGreen = "prussian_green",
  Blue = "blue",
  Purple = "purple",
  Magenta = "magenta",
  Red = "red",
}

const ThemedRadioButton = ({
  className,
  color,
  label,
  name,
  value,
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label className={classNames(className, "general-form__radio--themed")}>
      <input
        checked={value === color}
        className={`general-form__radio radio--theme-${color}`}
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
