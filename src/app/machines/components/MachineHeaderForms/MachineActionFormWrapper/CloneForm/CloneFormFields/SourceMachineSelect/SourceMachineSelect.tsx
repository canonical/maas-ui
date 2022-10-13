import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Notification, Spinner, Strip } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch } from "react-redux";

import SourceMachineDetails from "./SourceMachineDetails";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import { MachineSelectTable } from "app/base/components/MachineSelectTable/MachineSelectTable";
import MachineListPagination from "app/machines/views/MachineList/MachineListTable/MachineListPagination";
import type { Machine, MachineDetails } from "app/store/machine/types";
import { FilterMachineItems } from "app/store/machine/utils";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import { actions as tagActions } from "app/store/tag";

export enum Label {
  Loading = "Loading...",
  NoSourceMachines = "No source machine available",
}

type Props = {
  className?: string;
  loadingData?: boolean;
  loadingMachineDetails?: boolean;
  pageSize?: number;
  onMachineClick: (machine: Machine | null) => void;
  selectedMachine?: MachineDetails | null;
};

export const SourceMachineSelect = ({
  className,
  loadingData = false,
  pageSize = 15,
  loadingMachineDetails = false,
  onMachineClick,
  selectedMachine = null,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // We filter by a subset of machine parameters rather than using the search
  // selector, because the search selector will match parameters that aren't
  // included in the clone source table.
  const { machines, machineCount, loading } = useFetchMachines({
    filters: FilterMachineItems.parseFetchFilters(debouncedText),
    pagination: {
      currentPage,
      pageSize,
      setCurrentPage,
    },
  });

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  let content: ReactNode;
  if (loadingData) {
    content = (
      <Strip shallow>
        <Spinner aria-label={Label.Loading} text={Label.Loading} />
      </Strip>
    );
  } else if (loadingMachineDetails || selectedMachine) {
    content = <SourceMachineDetails machine={selectedMachine} />;
  } else if (!loading && machineCount === 0) {
    content = (
      <Notification
        borderless
        severity="negative"
        title={Label.NoSourceMachines}
      >
        All machines are selected as destination machines. Unselect at least one
        machine from the list.
      </Notification>
    );
  } else {
    content = (
      <div className="source-machine-select__table">
        <MachineSelectTable
          machines={machines}
          machinesLoading={loading}
          onMachineClick={onMachineClick}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <MachineListPagination
          currentPage={currentPage}
          itemsPerPage={pageSize}
          machineCount={machineCount}
          machinesLoading={loading}
          paginate={setCurrentPage}
        />
      </div>
    );
  }
  return (
    <div className={classNames("source-machine-select", className)}>
      <DebounceSearchBox
        aria-label="Search by hostname, system ID or tags"
        autoComplete="off"
        autoFocus
        onChange={() => {
          // Unset the selected machine if the search input changes - assume
          // the user wants to change it.
          if (selectedMachine) {
            onMachineClick(null);
          }
        }}
        onDebounced={setDebouncedText}
        placeholder="Search by hostname, system ID or tags"
        role="combobox"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {content}
    </div>
  );
};

export default SourceMachineSelect;
