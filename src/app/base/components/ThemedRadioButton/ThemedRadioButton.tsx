// nick notes
// -Set up a useEffect for live preview
// -Remove from redux when "save" or "cancel"

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
  checked,
  className,
  colour,
  label,
  name,
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label className={classNames(className, "themedRadioButton")}>
      <input
        checked={checked}
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
