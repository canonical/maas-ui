import { Route, Switch } from "react-router-dom";

import DashboardConfigurationForm from "./DashboardConfigurationForm";
import DashboardHeader from "./DashboardHeader";
import DiscoveriesList from "./DiscoveriesList";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";

const Dashboard = (): JSX.Element => {
  return (
    <Section
      header={<DashboardHeader />}
      headerClassName="u-no-padding--bottom"
    >
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
