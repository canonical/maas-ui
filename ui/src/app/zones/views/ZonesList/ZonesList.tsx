import ZonesListHeader from "../ZonesListHeader";
import ZonesListTable from "../ZonesListTable";

import Section from "app/base/components/Section";

const ZonesList = (): JSX.Element => {
  return (
    <Section
      header={<ZonesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <ZonesListTable />
    </Section>
  );
};

export default ZonesList;
