import { Route, Switch } from "react-router-dom";

import DashboardConfigurationForm from "./DashboardConfigurationForm";
import DiscoveriesList from "./DiscoveriesList";

import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";

const Dashboard = (): JSX.Element => {
  return (
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
  );
};

export default Dashboard;
