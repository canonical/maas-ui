import { useState } from "react";

import { SearchBox } from "@canonical/react-components";

import { MachineSelectTable } from "app/base/components/MachineSelectTable/MachineSelectTable";
import MachineListPagination from "app/machines/views/MachineList/MachineListTable/MachineListPagination";
import type { Machine } from "app/store/machine/types";
import { FilterGroupKey } from "app/store/machine/types";
import { useFetchMachines } from "app/store/machine/utils/hooks";

const MachineSelectBox = ({
  onSelect,
  pageSize = 15,
}: {
  pageSize?: number;
  onSelect: (machine: Machine | null) => void;
}): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setPage] = useState(1);
  const { machines, machineCount, loading } = useFetchMachines({
    currentPage,
    pageSize,
    filters: { [FilterGroupKey.FreeText]: searchText },
  });
  return (
    <div className="machine-select-box" role="listbox">
      <SearchBox
        autoComplete="off"
        autoFocus
        externallyControlled
        onChange={(searchText: string) => {
          setSearchText(searchText);
        }}
        placeholder="Search by hostname, system ID or tags"
        value={searchText}
      />
      <MachineSelectTable
        machines={machines}
        machinesLoading={loading}
        onMachineClick={(machine) => {
          onSelect(machine);
        }}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <MachineListPagination
        currentPage={currentPage}
        itemsPerPage={pageSize}
        machineCount={machineCount}
        machinesLoading={loading}
        paginate={setPage}
      />
    </div>
  );
};
export default MachineSelectBox;
