import type { ReactNode } from "react";

// import classNames from "classnames";

export type Props = {
  className?: string;
  radioName?: string;
  label?: ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const ThemedRadioButton = ({
  className,
  label,
  name,
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label>
      {label}
      <input className="" name={name} type="radio" {...inputProps} />
    </label>
  );
};

export default ThemedRadioButton;
