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
  // The search text state is initialised from the URL.
  const [searchText, setSearchText] = useState(filtersToString(currentFilters));
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
        grouping={grouping}
        searchText={searchText}
        setGrouping={setGrouping}
        setHiddenGroups={setHiddenGroups}
        setSearchText={setSearchText}
      />
      <MachineListTable
        grouping={grouping}
        hiddenGroups={hiddenGroups}
        searchText={searchText}
        setHiddenGroups={setHiddenGroups}
      />
    </>
  );
};

export default MachineList;
