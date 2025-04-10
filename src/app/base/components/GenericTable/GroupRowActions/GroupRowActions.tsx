import type { ReactElement } from "react";

import { Button, Icon } from "@canonical/react-components";
import type { Row } from "@tanstack/react-table";

type GroupRowActionsProps<T> = {
  row: Row<T>;
};

const GroupRowActions = <T,>({
  row,
}: GroupRowActionsProps<T>): ReactElement => {
  return (
    <Button
      appearance="base"
      dense
      hasIcon
      onClick={() => {
        row.toggleExpanded();
      }}
      type="button"
    >
      {row.getIsExpanded() ? (
        <Icon name="minus">Collapse</Icon>
      ) : (
        <Icon name="plus">Expand</Icon>
      )}
    </Button>
  );
};

export default GroupRowActions;
