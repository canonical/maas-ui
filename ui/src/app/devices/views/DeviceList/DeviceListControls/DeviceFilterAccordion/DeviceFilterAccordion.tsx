import { useSelector } from "react-redux";

import FilterAccordion from "app/base/components/FilterAccordion";
import deviceSelectors from "app/store/device/selectors";
import { FilterDevices, getDeviceValue } from "app/store/device/utils";

type Props = {
  searchText: string;
  setSearchText: (searchText: string) => void;
};

const filterOrder = [
  "domain",
  "fabrics",
  "ip_assignment",
  "owner",
  "subnets",
  "tags",
  "zone",
];

const filterNames = new Map([
  ["domain", "Domain"],
  ["fabrics", "Fabrics"],
  ["ip_assignment", "IP assignment"],
  ["owner", "Owner"],
  ["subnets", "Subnets"],
  ["tags", "Tags"],
  ["zone", "Zone"],
]);

const DeviceFilterAccordion = ({
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const devices = useSelector(deviceSelectors.all);
  const devicesLoaded = useSelector(deviceSelectors.loaded);

  return (
    <FilterAccordion
      disabled={!devicesLoaded}
      filterItems={FilterDevices}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filterString={searchText}
      getValue={getDeviceValue}
      items={devices}
      onUpdateFilterString={setSearchText}
    />
  );
};

export default DeviceFilterAccordion;
