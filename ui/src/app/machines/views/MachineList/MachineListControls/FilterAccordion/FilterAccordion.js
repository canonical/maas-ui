import {
  Accordion,
  Button,
  ContextualMenu,
  List,
  Spinner,
} from "@canonical/react-components";
import { useSelector } from "react-redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import {
  getCurrentFilters,
  isFilterActive,
  filtersToString,
  toggleFilter,
  WORKLOAD_FILTER_PREFIX,
} from "app/machines/search";
import { getMachineValue, formatSpeedUnits } from "app/utils";
import machineSelectors from "app/store/machine/selectors";

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

const getFilters = (machines) => {
  const filters = new Map();
  machines.forEach((machine) => {
    filterOrder.forEach((filter) => {
      let value = getMachineValue(machine, filter);
      // This is not a useful value so skip it.
      if (!value) {
        return;
      }
      // Turn everything into an array so we can loop over all values.
      if (!Array.isArray(value)) {
        value = [value];
      }
      let storedFilter = filters.get(filter);
      if (!storedFilter) {
        filters.set(filter, new Map());
        storedFilter = filters.get(filter);
      }
      value.forEach((filterValue) => {
        let storedValue = storedFilter.get(filterValue);
        if (!storedValue) {
          storedFilter.set(filterValue, 0);
          storedValue = storedFilter.get(filterValue);
        }
        storedFilter.set(filterValue, storedValue + 1);
      });
    });
  });
  return filters;
};

const sortByFilterName = (a, b) => {
  a = a[0];
  b = b[0];
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const FilterAccordion = ({ searchText, setSearchText }) => {
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const filterOptions = useMemo(() => getFilters(machines), [machines]);
  const currentFilters = getCurrentFilters(searchText);
  const [expandedSection, setExpandedSection] = useState();
  let sections;
  if (machinesLoaded) {
    sections = filterOrder.reduce((options, filter) => {
      const filterValues = filterOptions.get(filter);
      if (filterValues && filterValues.size > 0) {
        options.push({
          title: filterNames.get(filter),
          content: (
            <List
              className="u-no-margin--bottom"
              items={Array.from(filterValues)
                .sort(sortByFilterName)
                .map(([filterValue, count]) => (
                  <Button
                    appearance="base"
                    className={classNames(
                      "u-align-text--left u-no-margin--bottom filter-accordion__item is-dense",
                      {
                        "is-active": isFilterActive(
                          currentFilters,
                          filter,
                          filterValue,
                          true
                        ),
                      }
                    )}
                    onClick={() => {
                      let newFilters;
                      if (filter === "workload_annotations") {
                        // Workload annotation filters are treated differently,
                        // as filtering is done based on arbitrary object keys
                        // rather than simple, defined machine values.
                        const workloadFilter = `${WORKLOAD_FILTER_PREFIX}${filterValue}`;
                        if (workloadFilter in currentFilters) {
                          // If the workload annotation filter already exists,
                          // remove it entirely.
                          const {
                            [workloadFilter]: omit,
                            ...rest
                          } = currentFilters;
                          newFilters = rest;
                        } else {
                          // Otherwise, add an empty filter, which matches any
                          // machine with that workload.
                          newFilters = toggleFilter(
                            currentFilters,
                            workloadFilter,
                            "",
                            false
                          );
                        }
                      } else {
                        newFilters = toggleFilter(
                          currentFilters,
                          filter,
                          filterValue,
                          true
                        );
                      }
                      setSearchText(filtersToString(newFilters));
                    }}
                  >
                    {filter === "link_speeds"
                      ? formatSpeedUnits(filterValue)
                      : filterValue}{" "}
                    ({count})
                  </Button>
                ))}
            />
          ),
          key: filter,
        });
      }
      return options;
    }, []);
  }

  return (
    <ContextualMenu
      className="filter-accordion"
      constrainPanelWidth
      hasToggleIcon
      position="left"
      toggleClassName="filter-accordion__toggle"
      toggleLabel="Filters"
    >
      {machinesLoaded ? (
        <Accordion
          className="filter-accordion__dropdown"
          expanded={expandedSection}
          externallyControlled
          onExpandedChange={setExpandedSection}
          sections={sections}
        />
      ) : (
        <Spinner text="Loading..." />
      )}
    </ContextualMenu>
  );
};

FilterAccordion.propTypes = {
  searchText: PropTypes.string,
  setSearchText: PropTypes.func.isRequired,
};

export default FilterAccordion;
