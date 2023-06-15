import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";
import MachineActionFormWrapper from "./MachineActionFormWrapper";

import type { SidePanelContent } from "app/base/side-panel-context";
import type { SetSearchFilter } from "app/base/types";
import { MachineSidePanelViews } from "app/machines/constants";
import type { MachineActionSidePanelViews } from "app/machines/constants";
import type {
  MachineActionVariableProps,
  MachineSidePanelContent,
  MachineSetSidePanelContent,
} from "app/machines/types";

type Props = {
  sidePanelContent: SidePanelContent;
  setSidePanelContent: MachineSetSidePanelContent;
  setSearchFilter?: SetSearchFilter;
  viewingDetails?: boolean;
} & MachineActionVariableProps;

export const MachineForms = ({
  sidePanelContent,
  machines,
  setSidePanelContent,
  selectedCountLoading,
  searchFilter,
  selectedCount,
  selectedMachines,
  setSearchFilter,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case MachineSidePanelViews.ADD_CHASSIS:
      return <AddChassisForm clearSidePanelContent={clearSidePanelContent} />;
    case MachineSidePanelViews.ADD_MACHINE:
      return <AddMachineForm clearSidePanelContent={clearSidePanelContent} />;
    default:
      // We need to explicitly cast sidePanelContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const { extras, view } = sidePanelContent as {
        extras: MachineSidePanelContent["extras"];
        view: ValueOf<typeof MachineActionSidePanelViews>;
      };
      const [, action] = view;
      const conditionalProps = machines
        ? { machines }
        : {
            selectedCount,
            selectedCountLoading,
            selectedMachines,
            searchFilter,
          };
      return (
        <MachineActionFormWrapper
          action={action}
          applyConfiguredNetworking={extras?.applyConfiguredNetworking}
          clearSidePanelContent={clearSidePanelContent}
          hardwareType={extras?.hardwareType}
          setSearchFilter={setSearchFilter}
          viewingDetails={viewingDetails}
          {...conditionalProps}
        />
      );
  }
};

export default MachineForms;
