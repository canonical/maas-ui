import type { ReactElement } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import { Notification as NotificationBanner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoverySettings/NetworkDiscoveryForm";
import NetworkDiscoverySubnetForm from "@/app/settings/views/Network/NetworkDiscoverySettings/NetworkDiscoverySubnetForm";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import configSelectors from "@/app/store/config/selectors";
import { hasPermissions } from "@/app/utils/permissions";

export enum Label {
  Title = "Dashboard configuration",
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const NetworkDiscoverySettings = (): ReactElement => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const userEntitlements = useGetUserEntitlements();
  const canView = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_VIEW_CONFIGURATIONS,
  ]);

  useWindowTitle("Network discovery settings");

  if (!canView) {
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
            <NetworkDiscoverySubnetForm />
          </div>
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default NetworkDiscoverySettings;
