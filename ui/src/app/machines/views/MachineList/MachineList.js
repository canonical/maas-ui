import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";
import PropTypes from "prop-types";
import { useEffect } from "react";

import { formatErrors } from "app/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { useWindowTitle } from "app/base/hooks";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";

const MachineList = ({ headerFormOpen, searchFilter, setSearchFilter }) => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const filteredMachines = useSelector((state) =>
    machineSelectors.search(state, searchFilter, selectedIDs)
  );
  const errorMessage = formatErrors(errors);
  const [grouping, setGrouping] = useStorageState(
    localStorage,
    "grouping",
    "status"
  );
  const [hiddenGroups, setHiddenGroups] = useStorageState(
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
          close={() => dispatch(machineActions.cleanup())}
          type="negative"
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

MachineList.propTypes = {
  headerFormOpen: PropTypes.bool,
  searchFilter: PropTypes.string,
  setSearchFilter: PropTypes.func.isRequired,
};

export default MachineList;
