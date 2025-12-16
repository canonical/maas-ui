import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate, useMatch } from "react-router";
import { useStorageState } from "react-storage-hooks";

import MachineListHeader from "./MachineList/MachineListHeader";
import { useGrouping, useResponsiveColumns } from "./MachineList/hooks";

import PageContent from "@/app/base/components/PageContent/PageContent";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { SyncNavigateFunction } from "@/app/base/types";
import urls from "@/app/base/urls";
import MachineList from "@/app/machines/views/MachineList";
import machineSelectors from "@/app/store/machine/selectors";
import { selectedToFilters, FilterMachines } from "@/app/store/machine/utils";

const Machines = (): ReactElement => {
  const navigate: SyncNavigateFunction = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const { closeSidePanel } = useSidePanel();

  const machinesPathMatch = useMatch(urls.machines.index);
  const selectedMachines = useSelector(machineSelectors.selected);

  // Close the side panel when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      closeSidePanel();
    }
  }, [closeSidePanel, machinesPathMatch, selectedMachines]);

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
        />
      }
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      <MachineList
        grouping={grouping}
        hiddenColumns={hiddenColumns}
        hiddenGroups={hiddenGroups}
        searchFilter={searchFilter}
        setHiddenGroups={setHiddenGroups}
      />
    </PageContent>
  );
};

export default Machines;
