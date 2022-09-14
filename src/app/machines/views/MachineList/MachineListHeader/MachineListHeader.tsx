import { useCallback, useEffect } from "react";

import { usePrevious } from "@canonical/react-components";
import { useSelector } from "react-redux";
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
import machineSelectors from "app/store/machine/selectors";
import { FilterMachineItems, selectedToFilters } from "app/store/machine/utils";
import {
  useFetchMachineCount,
  useHasSelection,
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
  const selected = useSelector(machineSelectors.selected);
  let selectedState = useSelector(machineSelectors.selectedMachines);
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  // Get the count of all machines that match the current filters.
  const { machineCount, machineCountLoading } = useFetchMachineCount(
    FilterMachineItems.parseFetchFilters(searchFilter)
  );
  let selectedCount = 0;
  // Shallow clone the selected state so that object can be modified.
  let selectedMachines = selectedState ? { ...selectedState } : null;
  // Remove selected items from the filters to send to the API. We can count
  // them client side and filters are combined with AND which we don't want to do when
  // there are selected groups and items (otherwise it will be counting the
  // machines that match both the groups and the items).
  if (selectedMachines && "items" in selectedMachines) {
    selectedCount += selectedMachines.items?.length ?? 0;
    delete selectedMachines.items;
  }
  // Get the count of machines in selected groups or filters.
  const filters = selectedToFilters(selectedMachines);
  const {
    machineCount: fetchedSelectedCount,
    machineCountLoading: selectedLoading,
  } = useFetchMachineCount(filters);
  // Only add the count if there are filters as sending `null` filters
  // to the count API will return a count of all machines.
  if (filters) {
    selectedCount += fetchedSelectedCount;
  }
  const onlyHasItems =
    !!selectedMachines &&
    selectedCount > 0 &&
    (!("groups" in selectedMachines) || !selectedMachines?.groups?.length);

  const previousSelectedCount = usePrevious(selectedCount);

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
        />,
      ]}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            machines={selected}
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
      subtitleLoading={
        // There's no need to wait for the selected count to respond if there
        // are only items as we can count them client side.
        machineCountLoading || onlyHasItems ? false : selectedLoading
      }
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
