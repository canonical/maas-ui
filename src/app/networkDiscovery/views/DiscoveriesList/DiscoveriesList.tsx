import type { ReactElement } from "react";

import { Notification as NotificationBanner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import {
  DiscoveriesTable,
  NetworkDiscoveryHeader,
} from "@/app/networkDiscovery/components";
import configSelectors from "@/app/store/config/selectors";

export enum Labels {
  DiscoveriesList = "Discoveries list",
  Loading = "Loading...",
  AddDiscovery = "Add discovery...",
  DeleteDiscovery = "Delete discovery...",
  Disabled = "List of devices will not update as discovery is turned off.",
}

const DiscoveriesList = (): ReactElement => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);

  useWindowTitle("Network discovery");

  return (
    <PageContent header={<NetworkDiscoveryHeader />}>
      {networkDiscovery === "disabled" && (
        <NotificationBanner severity="caution">
          {Labels.Disabled}
        </NotificationBanner>
      )}
      <DiscoveriesTable />
    </PageContent>
  );
};

export default DiscoveriesList;
