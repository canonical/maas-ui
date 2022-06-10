import { ContextualMenu } from "@canonical/react-components";

import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetHeaderContent } from "app/machines/types";

type Props = {
  disabled?: boolean;
  setHeaderContent: MachineSetHeaderContent;
};

export const AddHardwareMenu = ({
  disabled = false,
  setHeaderContent,
}: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-testid="add-hardware-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Machine",
          onClick: () =>
            setHeaderContent({ view: MachineHeaderViews.ADD_MACHINE }),
        },
        {
          children: "Chassis",
          onClick: () =>
            setHeaderContent({ view: MachineHeaderViews.ADD_CHASSIS }),
        },
      ]}
      position="right"
      toggleDisabled={disabled}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
