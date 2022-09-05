import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";
import type { GetHostColumn, GetResources } from "./VMsTable/VMsTable";

import type { SetSearchFilter, SortDirection } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { DEFAULTS } from "app/machines/views/MachineList/MachineListTable/constants";
import { actions as machineActions } from "app/store/machine";
import type { FetchGroupKey } from "app/store/machine/types";
import { FilterGroupKey } from "app/store/machine/types";
import { mapSortDirection, FilterMachineItems } from "app/store/machine/utils";
import { useFetchMachines } from "app/store/machine/utils/hooks";
import type { Pod } from "app/store/pod/types";

type Props = {
  displayForCluster?: boolean;
  getHostColumn?: GetHostColumn;
  getResources: GetResources;
  onAddVMClick?: () => void;
  pods: Pod["name"][];
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
};

export const VMS_PER_PAGE = 10;

const LXDVMsTable = ({
  displayForCluster,
  getHostColumn,
  getResources,
  onAddVMClick,
  pods,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<FetchGroupKey | null>(
    DEFAULTS.sortKey
  );
  const [sortDirection, setSortDirection] = useState<
    ValueOf<typeof SortDirection>
  >(DEFAULTS.sortDirection);
  const {
    loading,
    machineCount,
    machines: vms,
  } = useFetchMachines({
    currentPage,
    filters: {
      ...FilterMachineItems.parseFetchFilters(searchFilter),
      // Set the filters to get results that belong to this single pod or pods in a cluster.
      [FilterGroupKey.Pod]: pods,
    },
    pageSize: VMS_PER_PAGE,
    sortDirection: mapSortDirection(sortDirection),
    sortKey,
  });

  useEffect(
    () => () => {
      // Clear machine selected state when unmounting.
      dispatch(machineActions.setSelectedMachines(null));
    },
    [dispatch]
  );

  return (
    <>
      <VMsActionBar
        currentPage={currentPage}
        machinesLoading={loading}
        onAddVMClick={onAddVMClick}
        searchFilter={searchFilter}
        setCurrentPage={setCurrentPage}
        setHeaderContent={setHeaderContent}
        setSearchFilter={setSearchFilter}
        vmCount={machineCount ?? 0}
      />
      <VMsTable
        currentPage={currentPage}
        displayForCluster={displayForCluster}
        getHostColumn={getHostColumn}
        getResources={getResources}
        machinesLoading={loading}
        searchFilter={searchFilter}
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        sortKey={sortKey}
        vms={vms}
      />
    </>
  );
};

export default LXDVMsTable;
