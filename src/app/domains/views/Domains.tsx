import { Route, Switch } from "react-router-dom";

import DomainDetails from "./DomainDetails";
import DomainsList from "./DomainsList";

import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";

const Domains = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={urls.domains.index} render={() => <DomainsList />} />
      <Route
        exact
        path={urls.domains.details(null)}
        render={() => <DomainDetails />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Domains;
