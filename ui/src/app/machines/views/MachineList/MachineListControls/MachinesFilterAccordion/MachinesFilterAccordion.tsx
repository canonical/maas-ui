import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import FilterAccordion from "app/base/components/FilterAccordion";
import machineSelectors from "app/store/machine/selectors";
import { FilterMachines, getMachineValue } from "app/store/machine/utils";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { formatSpeedUnits } from "app/utils";
import type { FilterValue } from "app/utils/search/filter-handlers";

type Props = {
  searchText?: string;
  setSearchText: (searchText: string) => void;
};

const filterOrder = [
  "status",
  "owner",
  "pool",
  "architecture",
  "release",
  "tags",
  "workload_annotations",
  "storage_tags",
  "pod",
  "subnets",
  "fabrics",
  "zone",
  "numa_nodes_count",
  "sriov_support",
  "link_speeds",
];

const filterNames = new Map([
  ["architecture", "Architecture"],
  ["fabric", "Fabric"],
  ["fabrics", "Fabric"],
  ["link_speeds", "Link speed"],
  ["numa_nodes_count", "NUMA nodes"],
  ["owner", "Owner"],
  ["pod", "KVM"],
  ["pool", "Resource pool"],
  ["rack", "Rack"],
  ["release", "OS/Release"],
  ["spaces", "Space"],
  ["sriov_support", "SR-IOV support"],
  ["status", "Status"],
  ["storage_tags", "Storage tags"],
  ["subnet", "Subnet"],
  ["subnets", "Subnet"],
  ["tags", "Tags"],
  ["vlan", "VLAN"],
  ["workload_annotations", "Workload"],
  ["zone", "Zone"],
]);

const getValueDisplay = (filter: string, filterValue: FilterValue) =>
  filter === "link_speeds" && typeof filterValue === "number"
    ? formatSpeedUnits(filterValue)
    : filterValue;

const MachinesFilterAccordion = ({
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const tags = useSelector(tagSelectors.all);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <FilterAccordion
      disabled={!machinesLoaded}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filtersToString={FilterMachines.filtersToString}
      filterString={searchText}
      getCurrentFilters={FilterMachines.getCurrentFilters}
      getValue={(machine, filter) => getMachineValue(machine, filter, { tags })}
      getValueDisplay={getValueDisplay}
      isFilterActive={FilterMachines.isFilterActive}
      items={machines}
      onUpdateFilterString={setSearchText}
      toggleFilter={FilterMachines.toggleFilter}
    />
  );
};

export default MachinesFilterAccordion;
