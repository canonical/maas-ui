import type { ReactElement } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import { Notification as NotificationBanner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoverySettings/NetworkDiscoveryForm";
import NetworkDiscoverySubnetForm from "@/app/settings/views/Network/NetworkDiscoverySettings/NetworkDiscoverySubnetForm";
import configSelectors from "@/app/store/config/selectors";

export enum Label {
  Title = "Dashboard configuration",
  Disabled = "List of devices will not update as discovery is turned off.",
}

const NetworkDiscoverySettings = (): ReactElement => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);

  useWindowTitle("Network discovery settings");

  return (
    <PageContent
      header={
        <MainToolbar>
          <MainToolbar.Title>Network discovery</MainToolbar.Title>
        </MainToolbar>
      }
    >
      <ContentSection variant="narrow">
        <ContentSection.Content>
          {networkDiscovery === "disabled" && (
            <NotificationBanner severity="caution">
              {Label.Disabled}
            </NotificationBanner>
          )}
          <div aria-label={Label.Title}>
            <NetworkDiscoveryForm />
            <NetworkDiscoverySubnetForm />
          </div>
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default NetworkDiscoverySettings;
