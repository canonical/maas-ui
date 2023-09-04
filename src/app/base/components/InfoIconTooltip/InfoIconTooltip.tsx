import type { ReactNode } from "react";

import { Icon, Tooltip } from "@canonical/react-components";

const InfoIconTooltip = ({ message }: { message: ReactNode }) => {
  return (
    <Tooltip message={message} position="right">
      <Icon data-testid="info-icon-tooltip" name="information" />
    </Tooltip>
  );
};

export default InfoIconTooltip;
