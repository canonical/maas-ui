import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useMatch } from "react-router-dom-v5-compat";
import { useStorageState } from "react-storage-hooks";

import MachineForms from "../components/MachineForms";
import type { MachineSidePanelContent } from "../types";

import MachineListHeader from "./MachineList/MachineListHeader";
import { DEFAULTS } from "./MachineList/MachineListTable/constants";

import PageContent from "app/base/components/PageContent/PageContent";
import type { SidePanelContextType } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import urls from "app/base/urls";
import { getHeaderTitle } from "app/machines/utils";
import MachineList from "app/machines/views/MachineList";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { FetchGroupKey } from "app/store/machine/types";
import { selectedToFilters, FilterMachines } from "app/store/machine/utils";
import { useMachineSelectedCount } from "app/store/machine/utils/hooks";

const Machines = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const { sidePanelContent, setSidePanelContent } =
    useSidePanel() as SidePanelContextType<MachineSidePanelContent>;

  const machinesPathMatch = useMatch(urls.machines.index);
  const selectedMachines = useSelector(machineSelectors.selectedMachines);

  // Close the side panel when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

  const filter = FilterMachines.parseFetchFilters(searchFilter);
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  const [storedGrouping, setStoredGrouping] =
    useStorageState<FetchGroupKey | null>(
      localStorage,
      "grouping",
      DEFAULTS.grouping
    );
  // fallback to "None" if the stored grouping is not valid
  const grouping: FetchGroupKey =
    typeof storedGrouping === "string" &&
    Object.values(FetchGroupKey).includes(storedGrouping)
      ? storedGrouping
      : DEFAULTS.grouping;

  const [hiddenColumns, setHiddenColumns] = useStorageState<string[]>(
    localStorage,
    "machineListHiddenColumns",
    []
  );

  const handleSetGrouping = useCallback(
    (group: FetchGroupKey | null) => {
      setStoredGrouping(group);
      // clear selected machines on grouping change
      // we cannot reliably preserve the selected state for individual machines
      // as we are only fetching information about a group from the back-end
      dispatch(machineActions.setSelectedMachines(null));
    },
    [setStoredGrouping, dispatch]
  );

  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);

  const [hiddenGroups, setHiddenGroups] = useStorageState<(string | null)[]>(
    localStorage,
    "hiddenGroups",
    []
  );

  return (
    <PageContent
      header={
        <MachineListHeader
          grouping={grouping}
          hiddenColumns={hiddenColumns}
          searchFilter={searchFilter}
          setGrouping={handleSetGrouping}
          setHiddenColumns={setHiddenColumns}
          setHiddenGroups={setHiddenGroups}
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
        />
      }
      sidePanelContent={
        sidePanelContent && (
          <MachineForms
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
      sidePanelTitle={
        sidePanelContent ? getHeaderTitle("Machines", sidePanelContent) : null
      }
    >
      <MachineList
        grouping={grouping}
        headerFormOpen={!!sidePanelContent}
        hiddenColumns={hiddenColumns}
        hiddenGroups={hiddenGroups}
        searchFilter={searchFilter}
        setHiddenGroups={setHiddenGroups}
      />
    </PageContent>
  );
};

export default Machines;
