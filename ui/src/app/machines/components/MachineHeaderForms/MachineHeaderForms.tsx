import { useCallback } from "react";

import ActionFormWrapper from "./ActionFormWrapper";
import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";

import type { SetSearchFilter } from "app/base/types";
import { MachineHeaderNames } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getActionFromHeaderContent } from "app/machines/utils";

type Props = {
  headerContent: MachineHeaderContent;
  setHeaderContent: MachineSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
  viewingDetails?: boolean;
};

export const MachineHeaderForms = ({
  headerContent,
  setHeaderContent,
  setSearchFilter,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );
  const action = getActionFromHeaderContent(headerContent);

  if (action) {
    return (
      <ActionFormWrapper
        action={action}
        clearHeaderContent={clearHeaderContent}
        headerContent={headerContent}
        setSearchFilter={setSearchFilter}
        viewingDetails={viewingDetails}
      />
    );
  }
  switch (headerContent.name) {
    case MachineHeaderNames.ADD_CHASSIS:
      return <AddChassisForm clearHeaderContent={clearHeaderContent} />;
    case MachineHeaderNames.ADD_MACHINE:
      return <AddMachineForm clearHeaderContent={clearHeaderContent} />;
    default:
      return null;
  }
};

export default MachineHeaderForms;
