import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import domainsURLs from "app/domains/urls";

const Domains = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[domainsURLs.domains]}>
        <div>
          <div className="p-strip">
            <div className="u-fixed-width">
              <h1>DNS</h1>
              <p>Work in progress...</p>
            </div>
          </div>
        </div>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Domains;
