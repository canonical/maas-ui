// nick notes
// -build a component that works like a radio button
// -Similar to a toggle but takes a colour
// -"Switch"
// -Set up a useEffect for live preview
// -New values in redux for colours
// -Remove from redux when "save" or "cancel"
// -Pass in a component to formikfield (custom radio button)

import type { ReactNode } from "react";

import classNames from "classnames";

export type Props = {
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
  ...inputProps
}: Props): JSX.Element => {
  return (
    <label className={classNames(className, "themedRadioButton")}>
      <input
        className={`radioButton ${colour}`}
        name={name}
        type="radio"
        {...inputProps}
      />
      {label}
    </label>
  );
};

export default ThemedRadioButton;
