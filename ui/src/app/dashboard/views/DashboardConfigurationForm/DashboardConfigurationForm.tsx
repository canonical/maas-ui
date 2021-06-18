import DashboardConfigurationSubnetForm from "./DashboardConfigurationSubnetForm";

import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard configuration");

  return (
    <>
      <NetworkDiscoveryForm />
      <DashboardConfigurationSubnetForm />
    </>
  );
};

export default DashboardConfigurationForm;
