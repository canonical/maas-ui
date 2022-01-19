import { MachineMeta } from "app/store/machine/types";
import type { Machine } from "app/store/machine/types";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";
import type { FilterValue } from "app/utils/search/filter-handlers";
import {
  isFilterValue,
  isFilterValueArray,
} from "app/utils/search/filter-handlers";
import FilterItems from "app/utils/search/filter-items";

export type ExtraData = {
  tags: Tag[];
};

type SearchMappings = {
  [x: string]: (
    node: Machine,
    extraData?: ExtraData
  ) => FilterValue | FilterValue[] | null;
};

export const WORKLOAD_FILTER_PREFIX = "workload-";

// Helpers that convert the pseudo field on node to an actual
// value from the node.
const searchMappings: SearchMappings = {
  cpu: (node: Machine) => node.cpu_count,
  cores: (node: Machine) => node.cpu_count,
  ram: (node: Machine) => node.memory,
  mac: (node: Machine) =>
    node.pxe_mac ? [node.pxe_mac, ...node.extra_macs] : node.extra_macs,
  zone: (node: Machine) => node.zone.name,
  pool: (node: Machine) => node.pool.name,
  pod: (node: Machine) => node.pod?.name || null,
  "pod-id": (node: Machine) => node.pod?.id || null,
  power: (node: Machine) => node.power_state,
  release: (node: Machine) =>
    node.status_code === 6 || node.status_code === 9
      ? node.osystem + "/" + node.distro_series
      : "",
  hostname: (node: Machine) => node.hostname,
  ip_addresses: (node: Machine) =>
    node.ip_addresses?.map(({ ip }) => ip) || null,
  vlan: (node: Machine) => node.vlan?.name || null,
  numa_nodes_count: ({ numa_nodes_count }: Machine) => {
    const count = numa_nodes_count;
    return `${count} node${count !== 1 ? "s" : ""}`;
  },
  sriov_support: ({ sriov_support }: Machine) =>
    sriov_support ? "Supported" : "Not supported",
  tags: (node, extraData) =>
    extraData?.tags ? getTagNamesForIds(node.tags, extraData.tags) : [],
  workload_annotations: (node: Machine) => {
    if (Boolean(node.workload_annotations)) {
      return Object.keys(node.workload_annotations);
    }
    return null;
  },
};

export const getMachineValue = (
  machine: Machine,
  filter: string,
  extraData?: ExtraData
): FilterValue | FilterValue[] | null => {
  const mapFunc = filter in searchMappings ? searchMappings[filter] : null;
  let value: FilterValue | FilterValue[] | null = null;
  if (
    filter.startsWith(WORKLOAD_FILTER_PREFIX) &&
    Boolean(machine.workload_annotations)
  ) {
    // Workload annotation filters are treated differently, as filtering is done
    // based on arbitrary object keys rather than simple, defined machine values.
    const [, ...splitWorkload] = filter.split(WORKLOAD_FILTER_PREFIX);
    const workloadKey = splitWorkload.join("");
    value = machine.workload_annotations[workloadKey];
  } else if (mapFunc) {
    value = mapFunc(machine, extraData);
  } else if (machine.hasOwnProperty(filter)) {
    const machineValue = machine[filter as keyof Machine];
    // Only return values that are valid for filters, all other values should
    // use a map function above.
    if (isFilterValue(machineValue) || isFilterValueArray(machineValue)) {
      value = machineValue;
    }
  }
  return value;
};

export const FilterMachines = new FilterItems<
  Machine,
  MachineMeta.PK,
  ExtraData
>(MachineMeta.PK, getMachineValue, [
  { filter: "workload_annotations", prefix: "workload" },
]);
