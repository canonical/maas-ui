import { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import { useStorageState } from "react-storage-hooks";

import MachineForms from "../components/MachineForms";

import MachineListHeader from "./MachineList/MachineListHeader";
import { useGrouping, useResponsiveColumns } from "./MachineList/hooks";

import PageContent from "@/app/base/components/PageContent/PageContent";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import MachineList from "@/app/machines/views/MachineList";
import machineSelectors from "@/app/store/machine/selectors";
import { selectedToFilters, FilterMachines } from "@/app/store/machine/utils";
import { useMachineSelectedCount } from "@/app/store/machine/utils/hooks";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

const Machines = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const machinesPathMatch = useMatch(urls.machines.index);
  const selectedMachines = useSelector(machineSelectors.selected);

  // Close the side panel when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

  const filter = FilterMachines.parseFetchFilters(searchFilter);
  const setSearchFilter = useCallback(
    (searchText: string) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate(
        {
          search: FilterMachines.filtersToQueryString(filters),
        },
        { replace: true }
      );
    },
    [navigate, setFilter]
  );

  const [grouping, setGrouping] = useGrouping();

  const [hiddenColumns, setHiddenColumns] = useResponsiveColumns();

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
          setGrouping={setGrouping}
          setHiddenColumns={setHiddenColumns}
          setHiddenGroups={setHiddenGroups}
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
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
        sidePanelContent
          ? getSidePanelTitle("Machines", sidePanelContent)
          : null
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
