import React, { useCallback, useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import DiscoveriesTable from "@/app/networkDiscovery/components/DiscoveriesTable/DiscoveriesTable";
import DiscoveryAddForm from "@/app/networkDiscovery/components/DiscoveryAddForm";
import DiscoveryDeleteForm from "@/app/networkDiscovery/components/DiscoveryDeleteForm";
import NetworkDiscoveryHeader from "@/app/networkDiscovery/components/NetworkDiscoveryHeader";
import ClearAllForm from "@/app/networkDiscovery/components/NetworkDiscoveryHeader/ClearAllForm";
import { NetworkDiscoverySidePanelViews } from "@/app/networkDiscovery/constants";
import configSelectors from "@/app/store/config/selectors";

export enum Labels {
  DiscoveriesList = "Discoveries list",
  Loading = "Loading...",
  NoNewDiscoveries = "No new discoveries.",
  AddDiscovery = "Add discovery...",
  DeleteDiscovery = "Delete discovery...",
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const DiscoveriesList = (): React.ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isSuperUser = useGetIsSuperUser();

  useWindowTitle("Network Discovery");

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  const clearSidePanelContent = useCallback(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  if (!isSuperUser.data) {
    return (
      <PageContent
        header={<SectionHeader title={Labels.Permissions} />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === NetworkDiscoverySidePanelViews.ADD_DISCOVERY
  ) {
    const discovery =
      sidePanelContent.extras && "discovery" in sidePanelContent.extras
        ? sidePanelContent.extras.discovery
        : null;
    content = (
      <DiscoveryAddForm
        discovery={discovery!}
        onClose={clearSidePanelContent}
      />
    );
  } else if (
    sidePanelContent &&
    sidePanelContent.view === NetworkDiscoverySidePanelViews.DELETE_DISCOVERY
  ) {
    const discovery =
      sidePanelContent.extras && "discovery" in sidePanelContent.extras
        ? sidePanelContent.extras.discovery
        : null;
    content = (
      <DiscoveryDeleteForm
        discovery={discovery!}
        onClose={clearSidePanelContent}
      />
    );
  } else if (
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
        <Notification severity="caution">{Labels.Disabled}</Notification>
      )}
      <DiscoveriesTable />
    </PageContent>
  );
};

export default DiscoveriesList;
