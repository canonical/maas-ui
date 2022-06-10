import { Route, Switch } from "react-router-dom";

import DomainDetails from "./DomainDetails";
import DomainsList from "./DomainsList";

import NotFound from "app/base/views/NotFound";
import domainsURLs from "app/domains/urls";

const Domains = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={domainsURLs.domains} render={() => <DomainsList />} />
      <Route
        exact
        path={domainsURLs.details(null, true)}
        render={() => <DomainDetails />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Domains;
