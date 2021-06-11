import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard");

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <NetworkDiscoveryForm />
    </Section>
  );
};

export default DashboardConfigurationForm;
