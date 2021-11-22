import { useSelector } from "react-redux";

import FilterAccordion from "app/base/components/FilterAccordion";
import discoverySelectors from "app/store/discovery/selectors";
import {
  FilterDiscoveries,
  getDiscoveryValue,
} from "app/store/discovery/utils";

type Props = {
  searchText?: string;
  setSearchText: (searchText: string) => void;
};

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
}: Props): JSX.Element => {
  const discoveries = useSelector(discoverySelectors.all);
  const loaded = useSelector(discoverySelectors.loaded);

  return (
    <FilterAccordion
      disabled={!loaded}
      filterItems={FilterDiscoveries}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filterString={searchText}
      getValue={getDiscoveryValue}
      items={discoveries}
      onUpdateFilterString={setSearchText}
    />
  );
};

export default DiscoveriesFilterAccordion;
