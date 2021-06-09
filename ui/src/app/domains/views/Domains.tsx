import { Route, Switch } from "react-router-dom";

import DomainDetails from "./DomainDetails";
import DomainsList from "./DomainsList";

import NotFound from "app/base/views/NotFound";
import domainsURLs from "app/domains/urls";

const Domains = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={domainsURLs.domains}>
        <DomainsList />
      </Route>
      <Route exact path={domainsURLs.details(null, true)}>
        <DomainDetails />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Domains;
