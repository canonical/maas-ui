import type { ReactElement } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import { Notification as NotificationBanner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import NetworkDiscoveryConfigurationSubnetForm from "@/app/settings/views/Network/NetworkDiscoveryConfigurationForm/NetworkDiscoveryConfigurationSubnetForm";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoveryConfigurationForm/NetworkDiscoveryForm";
import configSelectors from "@/app/store/config/selectors";

export enum Label {
  Title = "Dashboard configuration",
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const NetworkDiscoveryConfigurationForm = (): ReactElement => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isSuperUser = useGetIsSuperUser();

  useWindowTitle(Label.Title);

  if (!isSuperUser.data) {
    return <PageContent header={<SectionHeader title={Label.Permissions} />} />;
  }

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
            <NetworkDiscoveryConfigurationSubnetForm />
          </div>
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default NetworkDiscoveryConfigurationForm;
