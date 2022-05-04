import type { ReactNode } from "react";

import type {
  ButtonProps,
  IconProps,
  SubComponentProps,
  TooltipProps,
} from "@canonical/react-components";
import { Button, Icon, Tooltip } from "@canonical/react-components";

import { breakLines, unindentString } from "app/utils";

type Props = Omit<TooltipProps, "children"> & {
  buttonProps?: SubComponentProps<ButtonProps>;
  children?: ReactNode;
  iconName?: IconProps["name"];
  iconProps?: SubComponentProps<Omit<IconProps, "name">>;
};

const TooltipButton = ({
  buttonProps,
  children,
  iconName = "information",
  iconProps,
  message,
  ...tooltipProps
}: Props): JSX.Element => {
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
        className="u-no-border u-no-margin u-text--default-size"
        hasIcon
        small
        type="button"
        {...buttonProps}
      >
        {children || <Icon name={iconName} {...iconProps} />}
      </Button>
    </Tooltip>
  );
};

export default TooltipButton;
