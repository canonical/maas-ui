import type { HTMLAttributes, ReactElement } from "react";

import { Spinner as PragmaSpinner } from "@canonical/react-ds-global";
import classNames from "classnames";

import { dsIconRoot } from "./iconRoot";

import "./_index.scss";

type Props = HTMLAttributes<HTMLSpanElement> & {
  /** Visible label beside the icon. Pragma's Spinner has no text of its own. */
  text?: string;
};

const Spinner = ({
  text,
  className,
  role = "alert",
  "aria-live": ariaLive = "polite",
  "aria-label": ariaLabel,
  ...spanProps
}: Props): ReactElement => {
  return (
    <span
      {...spanProps}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={classNames("p-spinner", className)}
      role={role}
    >
      <PragmaSpinner rootPath={dsIconRoot} />
      {text ? (
        <span>{text}</span>
      ) : ariaLabel ? null : (
        <span className="u-visually-hidden">Loading</span>
      )}
    </span>
  );
};

export default Spinner;
