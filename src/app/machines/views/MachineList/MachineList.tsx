import { useEffect } from "react";

import cloneDeep from "clone-deep";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import ErrorsNotification from "./ErrorsNotification";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
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

const MachineList = ({
  headerFormOpen,
  searchFilter,
  setSearchFilter,
}: Props): JSX.Element => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const filters = FilterMachines.getCurrentFilters(searchFilter);
  const [grouping, setGrouping] = useStorageState<FetchGroupKey | null>(
    localStorage,
    "grouping",
    FetchGroupKey.Status
  );
  const { machines, machinesErrors } = useFetchMachines(
    parseFilters(filters),
    grouping
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
      />
    </>
  );
};

export default MachineList;
