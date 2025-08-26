import type { ReactElement } from "react";

import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
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
  Permissions = "You do not have permission to view this page.",
}

const DiscoveriesList = (): ReactElement => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isSuperUser = useGetIsSuperUser();

  useWindowTitle("Network Discovery");

  if (!isSuperUser.data) {
    return (
      <PageContent
        header={<SectionHeader title={Labels.Permissions} />}
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
        <Notification severity="caution">{Labels.Disabled}</Notification>
      )}
      <DiscoveriesTable />
    </PageContent>
  );
};

export default DiscoveriesList;
