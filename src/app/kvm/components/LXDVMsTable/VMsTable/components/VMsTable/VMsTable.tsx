import { useCallback, useEffect, useState, type ReactNode } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import useVMsTableColumns from "../useVMsTableColumns/useVMsTableColumns";

import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import tagSelectors from "@/app/store/tag/selectors";

export enum Label {
  Name = "Name",
  Status = "Status",
  Ipv4 = "Ipv4",
  Ipv6 = "Ipv6",
  Hugepages = "Hugepages",
  Cores = "Cores",
  Ram = "Ram",
  Pool = "Pool",
  EmptyList = "No VMs available",
}

export type GetHostColumn = (vm: Machine) => ReactNode;

export type GetResources = (vm: Machine) => {
  hugepagesBacked: boolean;
  pinnedCores: number[];
  unpinnedCores: number;
};

type Props = {
  callId?: string | null;
  displayForCluster?: boolean;
  getHostColumn?: GetHostColumn;
  getResources: GetResources;
  vms: Machine[];
  isPending: boolean;
};
const VMsTable = ({
  callId,
  displayForCluster,
  getHostColumn,
  getResources,
  vms,
  isPending,
}: Props) => {
  // VMsTable
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fqdn", desc: true },
  ]);
  const dispatch = useDispatch();
  const selected = useSelector(machineSelectors.selected);
  const getSystemIdsFromRowSelection = useCallback(() => {
    const selectedVms = vms.filter((vm) =>
      Object.keys(rowSelection).includes(vm.id.toString())
    );
    return selectedVms.map((vm) => vm.system_id);
  }, [rowSelection, vms]);

  useEffect(() => {
    const selectedSystemIds = getSystemIdsFromRowSelection();
    if (selected === null && selectedSystemIds.length > 0) {
      dispatch(
        machineActions.setSelected({
          items: selectedSystemIds,
        })
      );
    }

    if (selected && "items" in selected && !!selected.items) {
      const selectedCopy = [...selected.items];
      if (
        selectedCopy.sort().join(",") !== selectedSystemIds.sort().join(",")
      ) {
        dispatch(
          machineActions.setSelected({
            items: selectedSystemIds,
          })
        );
      }
    }
  }, [dispatch, getSystemIdsFromRowSelection, selected]);

  const tags = useSelector(tagSelectors.all);

  const columns = useVMsTableColumns({
    callId: callId,
    getHostColumn: getHostColumn,
    getResources: getResources,
    tags: tags,
  });
  return (
    <GenericTable
      aria-label="VMs table"
      className="vms-table"
      columns={columns}
      data={vms}
      isLoading={isPending}
      noData={`No VMs in this ${displayForCluster ? "cluster" : "KVM host"} match the search criteria.`}
      selection={{
        rowSelection,
        setRowSelection,
        rowSelectionLabelKey: "fqdn",
      }}
      sorting={[{ id: "fqdn", desc: false }]}
      variant="regular"
    />
  );
};

export default VMsTable;
