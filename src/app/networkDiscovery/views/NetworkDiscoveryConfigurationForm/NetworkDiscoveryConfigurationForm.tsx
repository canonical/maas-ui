import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NetworkDiscoveryConfigurationSubnetForm from "../../components/NetworkDiscoveryConfigurationSubnetForm";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import ClearAllForm from "@/app/networkDiscovery/components/ClearAllForm";
import NetworkDiscoveryHeader from "@/app/networkDiscovery/components/NetworkDiscoveryHeader";
import { NetworkDiscoverySidePanelViews } from "@/app/networkDiscovery/constants";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoveryForm";
import configSelectors from "@/app/store/config/selectors";

export enum Label {
  Title = "Dashboard configuration",
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const NetworkDiscoveryConfigurationForm = (): ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isSuperUser = useGetIsSuperUser();

  useWindowTitle(Label.Title);

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  const clearSidePanelContent = useCallback(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  if (!isSuperUser.data) {
    return (
      <PageContent
        header={<SectionHeader title={Label.Permissions} />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view ===
      NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES
  ) {
    content = <ClearAllForm closeForm={clearSidePanelContent} />;
  }

  return (
    <PageContent
      header={
        <NetworkDiscoveryHeader setSidePanelContent={setSidePanelContent} />
      }
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Network discovery", sidePanelContent)} // "Clear all discoveries"
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
