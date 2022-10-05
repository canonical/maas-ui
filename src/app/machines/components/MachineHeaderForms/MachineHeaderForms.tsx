import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";
import MachineActionFormWrapper from "./MachineActionFormWrapper";

import type { SetSearchFilter } from "app/base/types";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineActionHeaderViews } from "app/machines/constants";
import type {
  MachineActionVariableProps,
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";

type Props = {
  headerContent: MachineHeaderContent;
  setHeaderContent: MachineSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
  viewingDetails?: boolean;
} & MachineActionVariableProps;

export const MachineHeaderForms = ({
  headerContent,
  machines,
  setHeaderContent,
  selectedCountLoading,
  selectedCount,
  selectedFilter,
  setSearchFilter,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  switch (headerContent.view) {
    case MachineHeaderViews.ADD_CHASSIS:
      return <AddChassisForm clearHeaderContent={clearHeaderContent} />;
    case MachineHeaderViews.ADD_MACHINE:
      return <AddMachineForm clearHeaderContent={clearHeaderContent} />;
    default:
      // We need to explicitly cast headerContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const { extras, view } = headerContent as {
        extras: MachineHeaderContent["extras"];
        view: ValueOf<typeof MachineActionHeaderViews>;
      };
      const [, action] = view;
      const conditionalProps = machines
        ? { machines }
        : { selectedCount, selectedCountLoading, selectedFilter };
      return (
        <MachineActionFormWrapper
          action={action}
          applyConfiguredNetworking={extras?.applyConfiguredNetworking}
          clearHeaderContent={clearHeaderContent}
          hardwareType={extras?.hardwareType}
          setSearchFilter={setSearchFilter}
          viewingDetails={viewingDetails}
          {...conditionalProps}
        />
      );
  }
};

export default MachineHeaderForms;
