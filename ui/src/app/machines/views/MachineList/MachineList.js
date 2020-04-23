import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";
import React, { useState } from "react";

import { formatErrors } from "app/utils";
import { machine as machineSelectors } from "app/base/selectors";
import { useLocation, useWindowTitle } from "app/base/hooks";
import { filtersToString, queryStringToFilters } from "app/machines/search";
import MachineListControls from "./MachineListControls";
import MachineListTable from "./MachineListTable";

const MachineList = () => {
  useWindowTitle("Machines");
  const { location } = useLocation();
  const currentFilters = queryStringToFilters(location.search);
  const errors = useSelector(machineSelectors.errors);
  const errorMessage = formatErrors(errors);

  // The filter state is initialised from the URL.
  const [filter, setFilter] = useState(filtersToString(currentFilters));
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
        <Notification type="negative">{errorMessage}</Notification>
      ) : null}
      <MachineListControls
        filter={filter}
        grouping={grouping}
        setFilter={setFilter}
        setGrouping={setGrouping}
        setHiddenGroups={setHiddenGroups}
      />
      <MachineListTable
        filter={filter}
        grouping={grouping}
        hiddenGroups={hiddenGroups}
        setHiddenGroups={setHiddenGroups}
      />
    </>
  );
};

export default MachineList;
