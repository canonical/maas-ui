import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import cloneDeep from "clone-deep";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import ErrorsNotification from "./ErrorsNotification";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";
import { DEFAULTS } from "./MachineListTable/constants";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter, SortDirection } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { FetchFilters } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import { FilterMachines, mapSortDirection } from "app/store/machine/utils";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import type { Filters } from "app/utils/search/filter-handlers";

type Props = {
  headerFormOpen?: boolean;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
};

const PAGE_SIZE = DEFAULTS.pageSize;

// TODO: this should construct the full set of filters once the API has been
// updated: https://github.com/canonical/app-tribe/issues/1125
export const parseFilters = (filters: Filters): FetchFilters => {
  const fetchFilters = cloneDeep(filters);
  // Remove the in:selected filter as this is done client side.
  delete fetchFilters.in;
  // The API doesn't currently support free search.
  delete fetchFilters.q;
  return fetchFilters;
};

const MachineList = ({
  headerFormOpen,
  searchFilter,
  setSearchFilter,
}: Props): JSX.Element => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<FetchGroupKey | null>(
    DEFAULTS.sortKey
  );
  const [sortDirection, setSortDirection] = useState<
    ValueOf<typeof SortDirection>
  >(DEFAULTS.sortDirection);
  const filters = FilterMachines.getCurrentFilters(searchFilter);
  const [grouping, setGrouping] = useStorageState<FetchGroupKey | null>(
    localStorage,
    "grouping",
    FetchGroupKey.Status
  );
  const { callId, loading, machineCount, machines, machinesErrors } =
    useFetchMachines({
      currentPage,
      filters: parseFilters(filters),
      grouping,
      pageSize: PAGE_SIZE,
      sortDirection: mapSortDirection(sortDirection),
      sortKey,
    });
  const [hiddenGroups, setHiddenGroups] = useStorageState<(string | null)[]>(
    localStorage,
    "hiddenGroups",
    []
  );

  useEffect(
    () => () => {
      // Clear machine selected state and clean up any machine errors etc.
      // when closing the list.
      dispatch(machineActions.setSelected([]));
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <>
      {errors && !headerFormOpen ? (
        <ErrorsNotification
          errors={errors}
          onAfterDismiss={() => dispatch(machineActions.cleanup())}
        />
      ) : null}
      {!headerFormOpen ? <ErrorsNotification errors={machinesErrors} /> : null}
      <MachineListControls
        filter={searchFilter}
        grouping={grouping}
        setFilter={setSearchFilter}
        setGrouping={setGrouping}
        setHiddenGroups={setHiddenGroups}
      />
      <MachineListTable
        callId={callId}
        currentPage={currentPage}
        filter={searchFilter}
        grouping={grouping}
        hiddenGroups={hiddenGroups}
        machineCount={machineCount}
        machines={machines}
        machinesLoading={loading}
        pageSize={PAGE_SIZE}
        selectedIDs={selectedIDs}
        setCurrentPage={setCurrentPage}
        setHiddenGroups={setHiddenGroups}
        setSearchFilter={setSearchFilter}
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        sortKey={sortKey}
      />
    </>
  );
};

export default MachineList;
