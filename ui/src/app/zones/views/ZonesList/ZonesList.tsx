import ZonesListHeader from "../ZonesListHeader";

import Section from "app/base/components/Section";

const ZonesList = (): JSX.Element => {
  return (
    <Section
      header={<ZonesListHeader />}
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default ZonesList;
