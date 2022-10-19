import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import ErrorsNotification from "./ErrorsNotification";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";
import { DEFAULTS } from "./MachineListTable/constants";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter, SortDirection } from "app/base/types";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { actions as generalActions } from "app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { FetchGroupKey } from "app/store/machine/types";
import { mapSortDirection, FilterMachineItems } from "app/store/machine/utils";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import type { RootState } from "app/store/root/types";

type Props = {
  headerFormOpen?: boolean;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
};

const PAGE_SIZE = DEFAULTS.pageSize;

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
  const handleSetGrouping = (group: FetchGroupKey | null) => {
    setStoredGrouping(group);
    // clear selected machines on grouping change
    // we cannot reliably preserve the selected state for individual machines
    // as we are only fetching information about a group from the back-end
    dispatch(machineActions.setSelectedMachines(null));
  };
  const handleSetSearchFilter = (filter: string) => {
    setSearchFilter(filter);
    // clear selected machines on filters change
    // we cannot reliably preserve the selected state for groups of machines
    // as we are only fetching information about a group from the back-end
    // and the contents of a group may change when different filters are applied
    dispatch(machineActions.setSelectedMachines(null));
  };
  const [hiddenGroups, setHiddenGroups] = useStorageState<(string | null)[]>(
    localStorage,
    "hiddenGroups",
    []
  );

  const { unconfiguredControllers, configuredControllers } = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );
  const vaultEnabled = useSelector(vaultEnabledSelectors.get);

  const { callId, loading, machineCount, machines, machinesErrors } =
    useFetchMachines({
      collapsedGroups: hiddenGroups,
      filters: FilterMachineItems.parseFetchFilters(searchFilter),
      grouping,
      sortDirection: mapSortDirection(sortDirection),
      sortKey,
      pagination: { currentPage, setCurrentPage, pageSize: PAGE_SIZE },
    });

  useEffect(
    () => () => {
      // Clear machine selected state and clean up any machine errors etc.
      // when closing the list.
      dispatch(machineActions.setSelectedMachines(null));
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
      {configuredControllers.length >= 1 &&
      unconfiguredControllers.length >= 1 ? (
        <Notification severity="caution" title="Incomplete Vault integration">
          Configure {unconfiguredControllers.length} other{" "}
          <a href="/controllers">
            {unconfiguredControllers.length > 1 ? "controllers" : "controller"}
          </a>{" "}
          with Vault to complete this operation. Check the{" "}
          <a href="/settings/configuration/security">security settings</a> for
          more information.
        </Notification>
      ) : unconfiguredControllers.length === 0 && vaultEnabled === false ? (
        <Notification severity="caution" title="Incomplete Vault integration">
          Migrate your secrets to Vault to complete this operation. Check the{" "}
          <a href="/settings/configuration/security">security settings</a> for
          more information.
        </Notification>
      ) : null}
      <MachineListControls
        filter={searchFilter}
        grouping={grouping}
        setFilter={handleSetSearchFilter}
        setGrouping={handleSetGrouping}
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
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        sortKey={sortKey}
      />
    </>
  );
};

export default MachineList;
