import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import DashboardConfigurationForm from "./DashboardConfigurationForm";
import DashboardHeader from "./DashboardHeader";
import DiscoveriesList from "./DiscoveriesList";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";

const Dashboard = (): JSX.Element => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const isAdmin = useSelector(authSelectors.isAdmin);

  if (!isAdmin) {
    return (
      <Section
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
      />
    );
  }

  return (
    <Section header={<DashboardHeader />}>
      {networkDiscovery === "disabled" && (
        <Notification data-testid="disabled-notification" severity="caution">
          List of devices will not update as discovery is turned off.
        </Notification>
      )}
      <Switch>
        <Route
          exact
          path={dashboardURLs.index}
          component={() => <DiscoveriesList />}
        />
        <Route
          exact
          path={dashboardURLs.configuration}
          component={() => <DashboardConfigurationForm />}
        />
        <Route path="*" component={() => <NotFound />} />
      </Switch>
    </Section>
  );
};

export default Dashboard;
