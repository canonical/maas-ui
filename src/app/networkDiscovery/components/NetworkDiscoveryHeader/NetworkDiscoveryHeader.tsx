import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { Link, useLocation } from "react-router";

import { useNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { ClearAllForm } from "@/app/networkDiscovery/components";

export enum Labels {
  ClearAll = "Clear all discoveries",
}

const NetworkDiscoveryHeader = (): ReactElement => {
  const location = useLocation();
  const { openSidePanel } = useSidePanel();
  const discoveries = useNetworkDiscoveries();

  const buttons: React.ReactElement[] = [
    <Button
      appearance="negative"
      data-testid="clear-all"
      disabled={discoveries.data?.total === 0}
      key="clear-all"
      onClick={() => {
        openSidePanel({
          component: ClearAllForm,
          title: "Clear all discoveries",
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
