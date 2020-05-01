import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import { formatErrors } from "app/utils";
import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";

const MachineList = ({ searchFilter, setSearchFilter }) => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
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

  return (
    <>
      {errorMessage ? (
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
        setSearchFilter={setSearchFilter}
        setHiddenGroups={setHiddenGroups}
      />
    </>
  );
};

MachineList.propTypes = {
  searchFilter: PropTypes.string,
  setSearchFilter: PropTypes.func.isRequired,
};

export default MachineList;
