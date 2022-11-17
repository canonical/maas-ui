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
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import machineSelectors from "app/store/machine/selectors";
import { FilterMachineItems, selectedToFilters } from "app/store/machine/utils";
import {
  useFetchMachineCount,
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
  const machinesPathMatch = useMatch(urls.machines.index);
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  const filter = FilterMachineItems.parseFetchFilters(searchFilter);
  // Get the count of all machines
  const { machineCount: allMachineCount } = useFetchMachineCount();
  // Get the count of all machines that match the current filter
  const { machineCount: availableMachineCount } = useFetchMachineCount(filter, {
    isEnabled: FilterMachineItems.isNonEmptyFilter(searchFilter),
  });
  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);
  const selectedMachines = useSelector(machineSelectors.selectedMachines);
  const sendAnalytics = useSendAnalytics();

  // Clear the header when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setHeaderContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setHeaderContent]);

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
              setHeaderContent({ view });
            }
            sendAnalytics(
              "Machine list action form",
              getNodeActionTitle(action),
              "Open"
            );
          }}
        />,
      ]}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            searchFilter={searchFilter}
            selectedCount={selectedCount}
            selectedCountLoading={selectedCountLoading}
            selectedMachines={selectedMachines}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        )
      }
      machineCount={allMachineCount}
      subtitle={
        <ModelListSubtitle
          available={availableMachineCount || allMachineCount}
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
