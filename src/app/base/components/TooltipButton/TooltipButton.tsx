import type { ReactNode } from "react";

import type {
  ButtonProps,
  IconProps,
  SubComponentProps,
  TooltipProps,
} from "@canonical/react-components";
import { Icon, Tooltip } from "@canonical/react-components";
import classNames from "classnames";

import Button from "@/app/base/components/Button";
import { breakLines, unindentString } from "@/app/utils";

import "./_index.scss";

type Props = Omit<TooltipProps, "aria-label" | "children"> & {
  "aria-label"?: ButtonProps["aria-label"];
  buttonProps?: SubComponentProps<Omit<ButtonProps, "aria-label">>;
  children?: ReactNode;
  iconName?: IconProps["name"];
  iconProps?: SubComponentProps<Omit<IconProps, "name">>;
};

const TooltipButton = ({
  "aria-label": ariaLabel,
  buttonProps,
  children,
  iconName = "information",
  iconProps,
  message,
  ...tooltipProps
}: Props): React.ReactElement => {
  const {
    className: buttonClassName = "u-no-border u-no-line-height u-no-margin",
    ...restButtonProps
  } = buttonProps ?? {};
  return (
    <Tooltip
      message={
        typeof message === "string"
          ? breakLines(unindentString(message))
          : message
      }
      {...tooltipProps}
    >
      <Button
        appearance="base"
        aria-label={ariaLabel}
        className={classNames("tooltip-button", buttonClassName, {
          "tooltip-button--icon-only": !children && iconName,
        })}
        hasIcon
        small
        type="button"
        {...restButtonProps}
      >
        {typeof children === "string" ? <span>{children}</span> : children}
        {iconName ? (
          <Icon aria-label={iconName} name={iconName} {...iconProps} />
        ) : null}
      </Button>
    </Tooltip>
  );
};

export default TooltipButton;
