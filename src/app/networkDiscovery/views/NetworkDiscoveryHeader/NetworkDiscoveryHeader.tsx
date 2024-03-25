import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { NetworkDiscoverySidePanelViews } from "../constants";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { discoveryActions } from "@/app/store/discovery";
import discoverySelectors from "@/app/store/discovery/selectors";

export enum Labels {
  ClearAll = "Clear all discoveries",
}

const NetworkDiscoveryHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): JSX.Element => {
  const location = useLocation();

  const discoveries = useSelector(discoverySelectors.all);

  useFetchActions([discoveryActions.fetch]);

  const buttons: JSX.Element[] = [
    <Button
      data-testid="clear-all"
      disabled={discoveries.length === 0}
      key="clear-all"
      onClick={() =>
        setSidePanelContent({
          view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
        })
      }
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
          label: pluralize("discovery", discoveries.length, true),
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
