import { useCallback, useEffect } from "react";

import { useSelector } from "react-redux";
import { useMatch } from "react-router-dom-v5-compat";
import { useStorageState } from "react-storage-hooks";

import AddHardwareMenu from "./AddHardwareMenu";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import { useSendAnalytics } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineSidePanelContent,
  MachineSetSidePanelContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import machineSelectors from "app/store/machine/selectors";
import { FilterMachines, selectedToFilters } from "app/store/machine/utils";
import {
  useFetchMachineCount,
  useHasSelection,
  useMachineSelectedCount,
} from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  sidePanelContent: MachineSidePanelContent | null;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const MachineListHeader = ({
  sidePanelContent,
  searchFilter,
  setSearchFilter,
  setSidePanelContent,
}: Props): JSX.Element => {
  const machinesPathMatch = useMatch(urls.machines.index);
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  const filter = FilterMachines.parseFetchFilters(searchFilter);
  const hasActiveFilter = FilterMachines.isNonEmptyFilter(searchFilter);
  // Get the count of all machines
  const { machineCount: allMachineCount } = useFetchMachineCount();
  // Get the count of all machines that match the current filter
  const { machineCount: activeFilterMachineCount } = useFetchMachineCount(
    filter,
    {
      isEnabled: hasActiveFilter,
    }
  );
  const availableMachineCount = hasActiveFilter
    ? activeFilterMachineCount
    : allMachineCount;
  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);
  const selectedMachines = useSelector(machineSelectors.selectedMachines);
  const sendAnalytics = useSendAnalytics();

  // Clear the header when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

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
          setSidePanelContent={setSidePanelContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
          excludeActions={[NodeActions.IMPORT_IMAGES]}
          getTitle={getTitle}
          hasSelection={hasSelection}
          key="machine-list-action-menu"
          nodeDisplay="machine"
          onActionClick={(action) => {
            if (action === NodeActions.TAG && !tagsSeen) {
              setTagsSeen(true);
            }
            const view = Object.values(MachineHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
            sendAnalytics(
              "Machine list action form",
              getNodeActionTitle(action),
              "Open"
            );
          }}
        />,
      ]}
      machineCount={allMachineCount}
      sidePanelContent={
        sidePanelContent && (
          <MachineHeaderForms
            searchFilter={searchFilter}
            selectedCount={selectedCount}
            selectedCountLoading={selectedCountLoading}
            selectedMachines={selectedMachines}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle("Machines", sidePanelContent)}
      subtitle={
        <ModelListSubtitle
          available={availableMachineCount || allMachineCount}
          modelName="machine"
          selected={selectedCount}
        />
      }
      subtitleLoading={selectedCountLoading}
      title={"Machines"}
    />
  );
};

export default MachineListHeader;
