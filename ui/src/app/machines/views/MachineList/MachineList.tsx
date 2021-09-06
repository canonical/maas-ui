import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { formatErrors } from "app/utils";

type Props = {
  headerFormOpen?: boolean;
  searchFilter?: string;
  setSearchFilter: SetSearchFilter;
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
  const filteredMachines = useSelector((state: RootState) =>
    machineSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const errorMessage = formatErrors(errors);
  const [grouping, setGrouping] = useStorageState(
    localStorage,
    "grouping",
    "status"
  );
  const [hiddenGroups, setHiddenGroups] = useStorageState<string[]>(
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
      {errorMessage && !headerFormOpen ? (
        <Notification
          onDismiss={() => dispatch(machineActions.cleanup())}
          severity="negative"
        >
          {errorMessage}
        </Notification>
      ) : null}
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
        machines={filteredMachines}
        selectedIDs={selectedIDs}
        setHiddenGroups={setHiddenGroups}
        setSearchFilter={setSearchFilter}
      />
    </>
  );
};

export default MachineList;
