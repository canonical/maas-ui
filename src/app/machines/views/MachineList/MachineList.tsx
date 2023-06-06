import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import ErrorsNotification from "./ErrorsNotification";
import MachineListTable from "./MachineListTable";
import { DEFAULTS } from "./MachineListTable/constants";

import VaultNotification from "app/base/components/VaultNotification";
import { useWindowTitle } from "app/base/hooks";
import type { SortDirection } from "app/base/types";
import { actions as controllerActions } from "app/store/controller";
import { actions as generalActions } from "app/store/general";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { FetchGroupKey } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import { useFetchMachinesWithGroupingUpdates } from "app/store/machine/utils/hooks";

type Props = {
  grouping: FetchGroupKey | null;
  hiddenColumns: string[];
  hiddenGroups: (string | null)[];
  headerFormOpen?: boolean;
  searchFilter: string;
  setHiddenGroups: (groups: (string | null)[]) => void;
};

const DEFAULT_PAGE_SIZE = DEFAULTS.pageSize;

const MachineList = ({
  grouping,
  hiddenColumns,
  hiddenGroups,
  headerFormOpen,
  searchFilter,
  setHiddenGroups,
}: Props): JSX.Element => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<FetchGroupKey | null>(
    DEFAULTS.sortKey
  );
  const [sortDirection, setSortDirection] = useState<
    ValueOf<typeof SortDirection>
  >(DEFAULTS.sortDirection);
  const [storedPageSize, setStoredPageSize] = useStorageState<number>(
    localStorage,
    "machineListPageSize",
    DEFAULT_PAGE_SIZE
  );
  // fallback to default if the stored value is not valid
  const pageSize =
    storedPageSize && typeof storedPageSize === "number"
      ? storedPageSize
      : DEFAULT_PAGE_SIZE;

  const { callId, loading, machineCount, machines, machinesErrors, groups } =
    useFetchMachinesWithGroupingUpdates({
      collapsedGroups: hiddenGroups,
      filters: FilterMachines.parseFetchFilters(searchFilter),
      grouping,
      sortDirection,
      sortKey,
      pagination: { currentPage, setCurrentPage, pageSize },
    });

  useEffect(
    () => () => {
      // Clear machine selected state and clean up any machine errors etc.
      // when closing the list.
      dispatch(machineActions.setSelected(null));
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  // Fetch vault enabled status and controllers on page load
  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(generalActions.fetchVaultEnabled());
  }, [dispatch]);

  return (
    <>
      {errors && !headerFormOpen ? (
        <ErrorsNotification
          errors={errors}
          onAfterDismiss={() => dispatch(machineActions.cleanup())}
        />
      ) : null}
      {!headerFormOpen ? <ErrorsNotification errors={machinesErrors} /> : null}
      <VaultNotification />
      <MachineListTable
        callId={callId}
        currentPage={currentPage}
        filter={searchFilter}
        grouping={grouping}
        groups={groups}
        hiddenColumns={hiddenColumns}
        hiddenGroups={hiddenGroups}
        machineCount={machineCount}
        machines={machines}
        machinesLoading={loading}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setHiddenGroups={setHiddenGroups}
        setPageSize={setStoredPageSize}
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        sortKey={sortKey}
      />
    </>
  );
};

export default MachineList;
