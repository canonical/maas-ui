import DashboardConfigurationSubnetForm from "./DashboardConfigurationSubnetForm";

import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";

export enum Label {
  Title = "Dashboard configuration",
}

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle(Label.Title);

  return (
    <div aria-label={Label.Title}>
      <NetworkDiscoveryForm />
      <DashboardConfigurationSubnetForm />
    </div>
  );
};

export default DashboardConfigurationForm;
