import { useSelector } from "react-redux";

import ZonesListTitle from "../ZonesListTitle";

import SectionHeader from "app/base/components/SectionHeader";
import zoneSelectors from "app/store/zone/selectors";

const ZonesListHeader = (): JSX.Element => {
  const zones = useSelector(zoneSelectors.count);
  return (
    <SectionHeader
      title={<ZonesListTitle />}
      subtitle={`${zones} AZs available`}
    ></SectionHeader>
  );
};

export default ZonesListHeader;
