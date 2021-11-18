import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";
import type { GetHostColumn, GetResources } from "./VMsTable/VMsTable";

import type { SetSearchFilter } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";

type Props = {
  displayForCluster?: boolean;
  getHostColumn?: GetHostColumn;
  getResources: GetResources;
  onRefreshClick: () => void;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
  vms: Machine[];
};

export const VMS_PER_PAGE = 10;

const LXDVMsTable = ({
  displayForCluster,
  getHostColumn,
  getResources,
  onRefreshClick,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
  vms,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(machineActions.fetch());

    return () => {
      // Clear machine selected state when unmounting.
      dispatch(machineActions.setSelected([]));
    };
  }, [dispatch]);

  return (
    <>
      <VMsActionBar
        currentPage={currentPage}
        onRefreshClick={onRefreshClick}
        searchFilter={searchFilter}
        setCurrentPage={setCurrentPage}
        setSearchFilter={setSearchFilter}
        setHeaderContent={setHeaderContent}
        vms={vms}
      />
      <VMsTable
        currentPage={currentPage}
        displayForCluster={displayForCluster}
        getHostColumn={getHostColumn}
        getResources={getResources}
        searchFilter={searchFilter}
        vms={vms}
      />
    </>
  );
};

export default LXDVMsTable;
