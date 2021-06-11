import type { ReactNode } from "react";

import PropTypes from "prop-types";

export type Props = {
  className?: string;
  label?: ReactNode;
  // TODO: Investigate why this won't work with React.HTMLProps<HTMLInputElement>.
} & React.PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const Switch = ({ className, label, ...inputProps }: Props): JSX.Element => {
  return (
    <label className={className}>
      {label}
      <input className="p-switch" type="checkbox" {...inputProps} />
      <div className="p-switch__slider"></div>
    </label>
  );
};

Switch.propTypes = {
  /**
   * Optional classes applied to the parent element.
   */
  className: PropTypes.string,
  /**
   * Label for switch.
   */
  label: PropTypes.node,
};

export default Switch;
