import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useStorageState } from "react-storage-hooks";

import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import type { SyncNavigateFunction } from "@/app/base/types";
import MachineForms from "@/app/machines/components/MachineForms";
import MachinesTable from "@/app/machines/components/MachinesTable/MachinesTable";
import MachineListHeader from "@/app/machines/views/MachineList/MachineListHeader";
import {
  useGrouping,
  useResponsiveColumns,
} from "@/app/machines/views/MachineList/hooks";
import { controllerActions } from "@/app/store/controller";
import { generalActions } from "@/app/store/general";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import { FilterMachines } from "@/app/store/machine/utils";
import { useMachineSelectedCount } from "@/app/store/machine/utils/hooks";

const MachinesList = () => {
  const dispatch = useDispatch();
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const navigate: SyncNavigateFunction = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);

  useWindowTitle("Machines");

  useEffect(
    () => () => {
      dispatch(machineActions.setSelected(null));
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  useFetchActions([controllerActions.fetch, generalActions.fetchVaultEnabled]);

  const [grouping, setGrouping] = useGrouping();
  const [hiddenColumns, setHiddenColumns] = useResponsiveColumns();
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );

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

  const [hiddenGroups, setHiddenGroups] = useStorageState<(string | null)[]>(
    localStorage,
    "hiddenGroups",
    []
  );

  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);

  const selectedMachines = useSelector(machineSelectors.selected);

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
      <MachinesTable
        grouping={grouping}
        hiddenColumns={hiddenColumns}
        hiddenGroups={hiddenGroups}
        searchFilter={filter}
      />
    </PageContent>
  );
};

export default MachinesList;
