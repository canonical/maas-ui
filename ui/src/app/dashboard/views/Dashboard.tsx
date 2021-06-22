import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import DashboardConfigurationForm from "./DashboardConfigurationForm";
import DashboardHeader from "./DashboardHeader";
import DiscoveriesList from "./DiscoveriesList";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";
import configSelectors from "app/store/config/selectors";

const Dashboard = (): JSX.Element => {
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  return (
    <Section
      header={<DashboardHeader />}
      headerClassName="u-no-padding--bottom"
    >
      {networkDiscovery === "disabled" && (
        <Notification data-test="disabled-notification" type="caution">
          List of devices will not update as discovery is turned off.
        </Notification>
      )}
      <Switch>
        <Route exact path={[dashboardURLs.index]}>
          <DiscoveriesList />
        </Route>
        <Route exact path={[dashboardURLs.configuration]}>
          <DashboardConfigurationForm />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Dashboard;
