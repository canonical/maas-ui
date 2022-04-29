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
  iconProps?: SubComponentProps<IconProps>;
};

const TooltipButton = ({
  buttonProps,
  children,
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
        className="u-display--block u-no-border u-no-margin"
        hasIcon
        small
        type="button"
        {...buttonProps}
      >
        {children || <Icon name="information" {...iconProps} />}
      </Button>
    </Tooltip>
  );
};

export default TooltipButton;
