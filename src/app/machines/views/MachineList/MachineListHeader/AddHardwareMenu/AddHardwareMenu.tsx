import { ContextualMenu } from "@canonical/react-components";

import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetSidePanelContent } from "app/machines/types";

type Props = {
  disabled?: boolean;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const AddHardwareMenu = ({
  disabled = false,
  setSidePanelContent,
}: Props): JSX.Element => {
  return (
    <ContextualMenu
      className="p-add-hardware-dropdown"
      data-testid="add-hardware-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Machine",
          onClick: () =>
            setSidePanelContent({ view: MachineHeaderViews.ADD_MACHINE }),
        },
        {
          children: "Chassis",
          onClick: () =>
            setSidePanelContent({ view: MachineHeaderViews.ADD_CHASSIS }),
        },
      ]}
      position="right"
      toggleDisabled={disabled}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
