import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useLocation, Link } from "react-router";

import { NetworkDiscoverySidePanelViews } from "../../constants";

import { useNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import SectionHeader from "@/app/base/components/SectionHeader";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";

export enum Labels {
  ClearAll = "Clear all discoveries",
}

const NetworkDiscoveryHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): React.ReactElement => {
  const location = useLocation();

  const discoveries = useNetworkDiscoveries();

  const buttons: React.ReactElement[] = [
    <Button
      appearance="negative"
      data-testid="clear-all"
      disabled={discoveries.data?.total === 0}
      key="clear-all"
      onClick={() => {
        setSidePanelContent({
          view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
        });
      }}
    >
      {Labels.ClearAll}
    </Button>,
  ];

  return (
    <SectionHeader
      buttons={buttons}
      tabLinks={[
        {
          active: location.pathname === urls.networkDiscovery.index,
          component: Link,
          label: pluralize("discovery", discoveries.data?.total, true),
          to: urls.networkDiscovery.index,
        },
        {
          active: location.pathname === urls.networkDiscovery.configuration,
          component: Link,
          label: "Configuration",
          to: urls.networkDiscovery.configuration,
        },
      ]}
      title="Network discovery"
    />
  );
};

export default NetworkDiscoveryHeader;
