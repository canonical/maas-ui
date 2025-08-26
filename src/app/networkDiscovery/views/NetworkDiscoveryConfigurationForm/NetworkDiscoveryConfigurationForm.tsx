import type { ReactElement } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import {
  NetworkDiscoveryConfigurationSubnetForm,
  NetworkDiscoveryHeader,
} from "@/app/networkDiscovery/components";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoveryForm";
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
    return (
      <PageContent
        header={<SectionHeader title={Label.Permissions} />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  return (
    <PageContent
      header={<NetworkDiscoveryHeader />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {networkDiscovery === "disabled" && (
        <Notification severity="caution">{Label.Disabled}</Notification>
      )}
      <div aria-label={Label.Title}>
        <NetworkDiscoveryForm />
        <NetworkDiscoveryConfigurationSubnetForm />
      </div>
    </PageContent>
  );
};

export default NetworkDiscoveryConfigurationForm;
