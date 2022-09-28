import { useCallback, useEffect } from "react";

import { usePrevious } from "@canonical/react-components";
import { useLocation } from "react-router-dom";
import { useStorageState } from "react-storage-hooks";

import AddHardwareMenu from "./AddHardwareMenu";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import { FilterMachineItems } from "app/store/machine/utils";
import {
  useFetchMachineCount,
  useFetchSelectedMachines,
  useHasSelection,
  useMachineSelectedCount,
} from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  headerContent: MachineHeaderContent | null;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: MachineSetHeaderContent;
};

export const MachineListHeader = ({
  headerContent,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const location = useLocation();
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  // Get the count of all machines that match the current filters.
  const { machineCount } = useFetchMachineCount(
    FilterMachineItems.parseFetchFilters(searchFilter)
  );
  const { selectedCount, selectedCountLoading } = useMachineSelectedCount();
  const previousSelectedCount = usePrevious(selectedCount);

  // we need to make sure we have the data for all selected machines
  // (including those in collapsed groups or out of bounds of the currently visible page)
  const { machines: selectedMachines, loading: machinesLoading } =
    useFetchSelectedMachines({
      isEnabled: hasSelection,
    });

  useEffect(() => {
    if (
      location.pathname !== urls.machines.index ||
      (selectedCount !== previousSelectedCount && selectedCount === 0)
    ) {
      setHeaderContent(null);
    }
  }, [
    location.pathname,
    setHeaderContent,
    selectedCount,
    previousSelectedCount,
  ]);

  const getTitle = useCallback(
    (action: NodeActions) => {
      if (action === NodeActions.TAG) {
        const title = getNodeActionTitle(action);
        if (!tagsSeen) {
          return (
            <>
              {title} <i className="p-text--small">(NEW)</i>
            </>
          );
        }
        return title;
      }
      return null;
    },
    [tagsSeen]
  );

  return (
    <MachinesHeader
      buttons={[
        <AddHardwareMenu
          disabled={hasSelection}
          key="add-hardware"
          setHeaderContent={setHeaderContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
          getTitle={getTitle}
          hasSelection={hasSelection}
          key="machine-list-action-menu"
          nodeDisplay="machine"
          nodes={selectedMachines}
          onActionClick={(action) => {
            if (action === NodeActions.TAG && !tagsSeen) {
              setTagsSeen(true);
            }
            const view = Object.values(MachineHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
          showCount
        />,
      ]}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            machines={selectedMachines}
            machinesLoading={machinesLoading}
            selectedCountLoading={selectedCountLoading}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        )
      }
      subtitle={
        <ModelListSubtitle
          available={machineCount}
          modelName="machine"
          selected={selectedCount}
        />
      }
      subtitleLoading={selectedCountLoading}
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
