import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";

const Dashboard = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[dashboardURLs.dashboard]}>
        <h1>Dashboard</h1>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Dashboard;
