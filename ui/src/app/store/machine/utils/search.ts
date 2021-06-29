import { WORKLOAD_FILTER_PREFIX } from "app/machines/search";
import type { FilterValue } from "app/machines/search";
import type { Machine } from "app/store/machine/types";

type SearchMappings = {
  [x: string]: (node: Machine) => FilterValue | FilterValue[] | null;
};

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
  workload_annotations: (node: Machine) => {
    if (Boolean(node.workload_annotations)) {
      return Object.keys(node.workload_annotations);
    }
    return null;
  },
};

const isFilterValue = (machineValue: unknown): machineValue is FilterValue => {
  return (
    (typeof machineValue === "string" || typeof machineValue === "number") &&
    (!!machineValue || machineValue === 0)
  );
};

const isFilterValueArray = (
  machineValue: unknown
): machineValue is FilterValue[] => {
  return Array.isArray(machineValue) && isFilterValue(machineValue[0]);
};

export const getMachineValue = (
  machine: Machine,
  filter: string
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
    value = mapFunc(machine);
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
