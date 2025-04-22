import { useSelector } from "react-redux";

import FilterAccordion from "@/app/base/components/FilterAccordion";
import discoverySelectors from "@/app/store/discovery/selectors";
import {
  FilterDiscoveries,
  getDiscoveryValue,
} from "@/app/store/discovery/utils";

type Props = {
  searchText?: string;
  setSearchText: (searchText: string) => void;
};

export enum Labels {
  FilterDiscoveries = "Filter discoveries",
}

const filterOrder = ["fabric_name", "vlan", "observer_hostname", "subnet"];

const filterNames = new Map([
  ["fabric_name", "Fabric"],
  ["observer_hostname", "Rack"],
  ["subnet", "Subnet"],
  ["vlan", "VLAN"],
]);

const DiscoveriesFilterAccordion = ({
  searchText,
  setSearchText,
}: Props): React.ReactElement => {
  const discoveries = useSelector(discoverySelectors.all);
  const loaded = useSelector(discoverySelectors.loaded);

  return (
    <FilterAccordion
      aria-label={Labels.FilterDiscoveries}
      disabled={!loaded}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filterString={searchText}
      filtersToString={FilterDiscoveries.filtersToString}
      getCurrentFilters={FilterDiscoveries.getCurrentFilters}
      getValue={getDiscoveryValue}
      isFilterActive={FilterDiscoveries.isFilterActive}
      items={discoveries}
      onUpdateFilterString={setSearchText}
      toggleFilter={FilterDiscoveries.toggleFilter}
    />
  );
};

export default DiscoveriesFilterAccordion;
