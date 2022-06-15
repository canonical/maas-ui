import type { ReactNode } from "react";

import classNames from "classnames";

export type Props = {
  className?: string;
  label?: ReactNode;
  // TODO: Investigate why this won't work with React.HTMLProps<HTMLInputElement>.
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const Switch = ({ className, label, ...inputProps }: Props): JSX.Element => {
  return (
    <label className={classNames(className, "p-switch")}>
      {label}
      <input className="p-switch__input" type="checkbox" {...inputProps} />
      <div className="p-switch__slider"></div>
    </label>
  );
};

export default Switch;
