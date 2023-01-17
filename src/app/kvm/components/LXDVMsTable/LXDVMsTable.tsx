import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";
import type { GetHostColumn, GetResources } from "./VMsTable/VMsTable";

import type { SetSearchFilter, SortDirection } from "app/base/types";
import type { KVMSetSidePanelContent } from "app/kvm/types";
import { DEFAULTS } from "app/machines/views/MachineList/MachineListTable/constants";
import { actions as machineActions } from "app/store/machine";
import type { FetchGroupKey } from "app/store/machine/types";
import { FilterGroupKey } from "app/store/machine/types";
import { FilterMachines, useFetchedCount } from "app/store/machine/utils";
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
  setSidePanelContent: KVMSetSidePanelContent;
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
  setSidePanelContent,
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
    callId,
    loading,
    machineCount,
    machines: vms,
  } = useFetchMachines({
    filters: {
      ...FilterMachines.parseFetchFilters(searchFilter),
      // Set the filters to get results that belong to this single pod or pods in a cluster.
      [FilterGroupKey.Pod]: pods,
    },
    sortDirection,
    sortKey,
    pagination: { currentPage, setCurrentPage, pageSize: VMS_PER_PAGE },
  });
  const count = useFetchedCount(machineCount, loading);
  const previousSearchFilter = usePrevious(searchFilter);

  useEffect(() => {
    // Clear machine selection and close the action form on filters change
    if (searchFilter !== previousSearchFilter) {
      setSidePanelContent(null);
      dispatch(machineActions.setSelectedMachines(null));
    }
  }, [searchFilter, previousSearchFilter, setSidePanelContent, dispatch]);

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
        onAddVMClick={onAddVMClick}
        searchFilter={searchFilter}
        setCurrentPage={setCurrentPage}
        setSearchFilter={setSearchFilter}
        setSidePanelContent={setSidePanelContent}
        vmCount={count}
      />
      <VMsTable
        callId={callId}
        displayForCluster={displayForCluster}
        getHostColumn={getHostColumn}
        getResources={getResources}
        machinesLoading={loading}
        pods={pods}
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
