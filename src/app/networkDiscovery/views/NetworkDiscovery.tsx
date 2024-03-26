import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import NetworkForm from "../components/NetworkForm";

import DiscoveriesList from "./DiscoveriesList";
import NetworkDiscoveryConfigurationForm from "./NetworkDiscoveryConfigurationForm";
import NetworkDiscoveryHeader from "./NetworkDiscoveryHeader";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import authSelectors from "@/app/store/auth/selectors";
import configSelectors from "@/app/store/config/selectors";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { getRelativeRoute } from "@/app/utils";

export enum Label {
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const NetworkDiscovery = (): JSX.Element => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  if (!isAdmin) {
    return (
      <PageContent
        header={<SectionHeader title={Label.Permissions} />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  const base = urls.networkDiscovery.index;
  return (
    <PageContent
      header={
        <NetworkDiscoveryHeader setSidePanelContent={setSidePanelContent} />
      }
      sidePanelContent={
        sidePanelContent && (
          <NetworkForm
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Network discovery", sidePanelContent)} // "Clear all discoveries"
    >
      {networkDiscovery === "disabled" && (
        <Notification severity="caution">{Label.Disabled}</Notification>
      )}
      <Routes>
        <Route element={<DiscoveriesList />} path="/" />
        <Route
          element={<NetworkDiscoveryConfigurationForm />}
          path={getRelativeRoute(urls.networkDiscovery.configuration, base)}
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </PageContent>
  );
};

export default NetworkDiscovery;
