import { GenericTable } from "@canonical/maas-react-components";
import { useSelector } from "react-redux";

import useVirshTableColumns from "../useVirshTableColumns/useVirshTableColumns";

import { usePools } from "@/app/api/query/pools";
import type { ResourcePoolResponse } from "@/app/apiclient";
import { useTableSort } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import { isComparable } from "@/app/utils";

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage" | "vms";

const getSortValue = (
  sortKey: SortKey,
  kvm: Pod,
  pools?: ResourcePoolResponse[]
) => {
  const { resources } = kvm;
  const { cores, memory, storage, vm_count } = resources;
  const kvmPool = pools?.find((pool) => kvm.pool === pool.id);

  switch (sortKey) {
    case "pool":
      return kvmPool?.name || "unknown";
    case "cpu":
      return cores.allocated_tracked;
    case "ram":
      return (
        memory.general.allocated_tracked + memory.hugepages.allocated_tracked
      );
    case "storage":
      return storage.allocated_tracked;
    case "tags":
      return (kvm.tags.length && kvm.tags[0]) || "";
    case "vms":
      return vm_count.tracked;
  }
  const value = kvm[sortKey];
  return isComparable(value) ? value : null;
};

const VirshTable = () => {
  const virshKvms = useSelector(podSelectors.virsh);
  const pools = usePools();

  const columns = useVirshTableColumns();
  const { currentSort, sortRows, updateSort } = useTableSort<
    Pod,
    SortKey,
    ResourcePoolResponse[]
  >(getSortValue, {
    key: "name",
    direction: SortDirection.DESCENDING,
  });
  const sortedKVMs = sortRows(virshKvms, pools.data?.items);

  return (
    <GenericTable
      aria-label="virsh table"
      className="virsh-table"
      columns={columns}
      data={sortedKVMs}
      noData="No pods available.."
    />
  );
};

export default VirshTable;
