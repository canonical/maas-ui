import { useEffect, useState } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";
import type { GetResources } from "./VMsTable/VMsTable";

import type { SetSearchFilter } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";

type Props = {
  getResources: GetResources;
  onRefreshClick: () => void;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
  vms: Machine[];
};

export const VMS_PER_PAGE = 10;

const LXDVMsTable = ({
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
    <Strip shallow>
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
        getResources={getResources}
        searchFilter={searchFilter}
        vms={vms}
      />
    </Strip>
  );
};

export default LXDVMsTable;
