import NetworkDiscoveryConfigurationSubnetForm from "./NetworkDiscoveryConfigurationSubnetForm";

import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";

export enum Label {
  Title = "Dashboard configuration",
}

const NetworkDiscoveryConfigurationForm = (): JSX.Element => {
  useWindowTitle(Label.Title);

  return (
    <div aria-label={Label.Title}>
      <NetworkDiscoveryForm />
      <NetworkDiscoveryConfigurationSubnetForm />
    </div>
  );
};

export default NetworkDiscoveryConfigurationForm;
