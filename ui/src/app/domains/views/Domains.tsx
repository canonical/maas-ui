import { Route, Switch } from "react-router-dom";

import DomainsList from "./DomainsList";

import NotFound from "app/base/views/NotFound";
import domainsURLs from "app/domains/urls";

const Domains = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[domainsURLs.domains]}>
        <DomainsList />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Domains;
