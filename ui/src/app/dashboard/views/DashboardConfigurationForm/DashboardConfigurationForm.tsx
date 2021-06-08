import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard");

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <h1>Hello</h1>
    </Section>
  );
};

export default DashboardConfigurationForm;
