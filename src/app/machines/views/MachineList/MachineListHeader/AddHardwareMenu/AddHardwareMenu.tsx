import { ContextualMenu } from "@canonical/react-components";

import { MachineSidePanelViews } from "app/machines/constants";
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
      className="is-maas-select"
      data-testid="add-hardware-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Machine",
          onClick: () =>
            setSidePanelContent({ view: MachineSidePanelViews.ADD_MACHINE }),
        },
        {
          children: "Chassis",
          onClick: () =>
            setSidePanelContent({ view: MachineSidePanelViews.ADD_CHASSIS }),
        },
      ]}
      position="right"
      toggleDisabled={disabled}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
