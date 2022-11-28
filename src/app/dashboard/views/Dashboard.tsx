import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom-v5-compat";

import DashboardConfigurationForm from "./DashboardConfigurationForm";
import DashboardHeader from "./DashboardHeader";
import DiscoveriesList from "./DiscoveriesList";

import MainContentSection from "app/base/components/MainContentSection";
import SectionHeader from "app/base/components/SectionHeader";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { getRelativeRoute } from "app/utils";

export enum Label {
  Disabled = "List of devices will not update as discovery is turned off.",
  Permissions = "You do not have permission to view this page.",
}

const Dashboard = (): JSX.Element => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isAdmin = useSelector(authSelectors.isAdmin);

  if (!isAdmin) {
    return (
      <MainContentSection
        header={<SectionHeader title={Label.Permissions} />}
      />
    );
  }

  const base = urls.dashboard.index;
  return (
    <MainContentSection header={<DashboardHeader />}>
      {networkDiscovery === "disabled" && (
        <Notification severity="caution">{Label.Disabled}</Notification>
      )}
      <Routes>
        <Route element={<DiscoveriesList />} path="/" />
        <Route
          element={<DashboardConfigurationForm />}
          path={getRelativeRoute(urls.dashboard.configuration, base)}
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </MainContentSection>
  );
};

export default Dashboard;
