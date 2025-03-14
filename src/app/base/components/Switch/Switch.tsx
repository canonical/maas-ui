import type { ReactNode } from "react";
import React from "react";

import classNames from "classnames";
import { JSX } from "react/jsx-runtime";

import IntrinsicElements = JSX.IntrinsicElements;

export type Props = {
  className?: string;
  label?: ReactNode;
  // TODO: Investigate why this won't work with React.HTMLProps<HTMLInputElement>.
} & React.PropsWithoutRef<IntrinsicElements["input"]>;

const Switch = ({ className, label, ...inputProps }: Props) => {
  return (
    <label className={classNames(className, "p-switch")}>
      {label}
      <input className="p-switch__input" type="checkbox" {...inputProps} />
      <div className="p-switch__slider"></div>
    </label>
  );
};

export default Switch;
