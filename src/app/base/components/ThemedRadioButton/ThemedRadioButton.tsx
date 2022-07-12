import type { ReactNode } from "react";

import classNames from "classnames";

export type Props = {
  checked?: boolean;
  className?: string;
  colour?: string;
  name?: string;
  label?: ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const ThemedRadioButton = ({
  className,
  colour,
  label,
  name,
  value,
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label className={classNames(className, "themedRadioButton")}>
      <input
        checked={value === colour}
        className={`radioButton ${colour}`}
        name={name}
        type="radio"
        {...inputProps}
        value={colour}
      />
      {label}
    </label>
  );
};

export default ThemedRadioButton;
