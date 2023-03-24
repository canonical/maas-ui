import { useCallback, useEffect } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom-v5-compat";
import { useStorageState } from "react-storage-hooks";

import MachineListControls from "../MachineListControls";

import AddHardwareMenu from "./AddHardwareMenu";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import type {
  MachineSidePanelContent,
  MachineSetSidePanelContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { FetchGroupKey } from "app/store/machine/types";
import { FilterMachines, selectedToFilters } from "app/store/machine/utils";
import {
  useFetchMachineCount,
  useHasSelection,
  useMachineSelectedCount,
} from "app/store/machine/utils/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";

type Props = {
  grouping: FetchGroupKey | null;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  setHiddenColumns: React.Dispatch<React.SetStateAction<string[]>>;
  sidePanelContent: MachineSidePanelContent | null;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const MachineListHeader = ({
  grouping,
  setGrouping,
  setHiddenGroups,
  sidePanelContent,
  searchFilter,
  setSearchFilter,
  setSidePanelContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machinesPathMatch = useMatch(urls.machines.index);
  const hasSelection = useHasSelection();
  const filter = FilterMachines.parseFetchFilters(searchFilter);
  // Get the count of all machines
  const { machineCount: allMachineCount } = useFetchMachineCount();
  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);
  const selectedMachines = useSelector(machineSelectors.selectedMachines);

  // Clear the header when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  const resourcePoolsCount = useSelector(resourcePoolSelectors.count);

  // fallback to "None" if the stored grouping is not valid
  const [hiddenColumns, setHiddenColumns] = useStorageState<string[]>(
    localStorage,
    "machineListHiddenColumns",
    []
  );

  const handleSetSearchFilter = useCallback(
    (filter: string) => {
      setSearchFilter(filter);
      // clear selected machines on filters change
      // we cannot reliably preserve the selected state for groups of machines
      // as we are only fetching information about a group from the back-end
      // and the contents of a group may change when different filters are applied
      dispatch(machineActions.setSelectedMachines(null));
    },
    [dispatch, setSearchFilter]
  );

  return (
    <MachinesHeader
      buttons={[
        <h1 className="section-header__title p-heading--4">
          {allMachineCount} machines in{" "}
          <Link to={urls.pools.index}>
            {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
          </Link>
        </h1>,
        <MachineListControls
          filter={searchFilter}
          grouping={grouping}
          hiddenColumns={hiddenColumns}
          setFilter={handleSetSearchFilter}
          setGrouping={setGrouping}
          setHiddenColumns={setHiddenColumns}
          setHiddenGroups={setHiddenGroups}
          setSidePanelContent={setSidePanelContent}
        />,
        <AddHardwareMenu
          disabled={hasSelection}
          key="add-hardware"
          setSidePanelContent={setSidePanelContent}
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
      subtitleLoading={selectedCountLoading}
      // title={
      //   <>
      //     {allMachineCount} machines in{" "}
      //     <Link to={urls.pools.index}>
      //       {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
      //     </Link>
      //   </>
      // }
    />
  );
};

export default MachineListHeader;
