import type {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";

import { Button as PragmaButton } from "@canonical/react-ds-global";
import classNames from "classnames";

type Appearance =
  "" | "base" | "brand" | "link" | "negative" | "neutral" | "positive";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  /** Vanilla appearance. Mapped onto Pragma importance, anticipation, and variant. */
  appearance?: Appearance | string;
  children?: ReactNode;
  className?: classNames.Argument;
  /** Accepted so existing call sites type-check. Pragma has no dense size. */
  dense?: boolean;
  /** Accepted so existing call sites type-check. Icons stay in `children`. */
  hasIcon?: boolean;
  /** Accepted so existing call sites type-check. Pragma buttons are inline-flex. */
  inline?: boolean;
  /** Accepted so existing call sites type-check. Pragma has no small size. */
  small?: boolean;
};

const mapAppearance = (
  appearance: Props["appearance"]
): {
  anticipation?: "constructive" | "destructive";
  importance: "primary" | "secondary" | "tertiary";
  variant?: "link";
} => {
  switch (appearance) {
    case "base":
      return { importance: "tertiary" };
    case "positive":
      return { anticipation: "constructive", importance: "primary" };
    case "negative":
      return { anticipation: "destructive", importance: "primary" };
    case "brand":
      return { importance: "primary" };
    case "link":
      return { importance: "tertiary", variant: "link" };
    default:
      return { importance: "secondary" };
  }
};

const Button = ({
  appearance = "",
  children,
  className,
  dense: _dense,
  disabled,
  hasIcon: _hasIcon,
  inline: _inline,
  onClick,
  small: _small,
  ...buttonProps
}: Props): ReactElement => {
  const mapped = mapAppearance(appearance);

  // Match Vanilla: use aria-disabled instead of the native attribute so disabled
  // buttons stay hoverable/focusable (e.g. for tooltips), and block activation.
  return (
    <PragmaButton
      aria-disabled={disabled || undefined}
      {...buttonProps}
      anticipation={mapped.anticipation}
      className={classNames(className) || undefined}
      importance={mapped.importance}
      onClick={
        disabled
          ? (event: MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
            }
          : onClick
      }
      variant={mapped.variant}
    >
      {children}
    </PragmaButton>
  );
};

export default Button;
