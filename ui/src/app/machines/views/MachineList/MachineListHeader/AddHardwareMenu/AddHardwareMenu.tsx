import { ContextualMenu } from "@canonical/react-components";

import { MachineHeaderNames } from "app/machines/constants";
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
      data-test="add-hardware-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Machine",
          onClick: () =>
            setHeaderContent({ name: MachineHeaderNames.ADD_MACHINE }),
        },
        {
          children: "Chassis",
          onClick: () =>
            setHeaderContent({ name: MachineHeaderNames.ADD_CHASSIS }),
        },
      ]}
      position="right"
      toggleAppearance="neutral"
      toggleDisabled={disabled}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
