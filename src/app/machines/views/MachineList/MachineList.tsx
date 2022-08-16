import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import cloneDeep from "clone-deep";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import { FetchSortDirection } from "../../../store/machine/types/actions";

import ErrorsNotification from "./ErrorsNotification";
import MachineListControls from "./MachineListControls";
import MachineListTable, { DEFAULTS } from "./MachineListTable";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import { SortDirection } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { FetchFilters } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import { actions as tagActions } from "app/store/tag";
import type { Filters } from "app/utils/search/filter-handlers";

type Props = {
  headerFormOpen?: boolean;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
};

// TODO: this should construct the full set of filters once the API has been
// updated: https://github.com/canonical/app-tribe/issues/1125
const parseFilters = (filters: Filters): FetchFilters => {
  const fetchFilters = cloneDeep(filters);
  // Remove the in:selected filter as this is done client side.
  delete fetchFilters.in;
  // The API doesn't currently support free search.
  delete fetchFilters.q;
  return fetchFilters;
};

const mapSortDirection = (
  sortDirection: ValueOf<typeof SortDirection>
): FetchSortDirection | null => {
  switch (sortDirection) {
    case SortDirection.ASCENDING:
      return FetchSortDirection.Ascending;
    case SortDirection.DESCENDING:
      return FetchSortDirection.Descending;
    default:
      return null;
  }
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
  const { machines, machinesErrors } = useFetchMachines(
    parseFilters(filters),
    grouping,
    sortKey,
    mapSortDirection(sortDirection)
  );
  const [hiddenGroups, setHiddenGroups] = useStorageState<string[]>(
    localStorage,
    "hiddenGroups",
    []
  );
  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

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
        filter={searchFilter}
        grouping={grouping}
        hiddenGroups={hiddenGroups}
        machines={machines}
        selectedIDs={selectedIDs}
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
