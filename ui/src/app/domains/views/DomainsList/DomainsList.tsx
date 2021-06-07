import { Route, Switch } from "react-router-dom";

import DomainListHeader from "./DomainListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import domainsURLs from "app/domains/urls";

const DomainsList = (): JSX.Element => {
  useWindowTitle("DNS");

  return (
    <Section
      header={<DomainListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <Switch>
        <Route exact path={domainsURLs.domains}>
          <p>Work in progress...</p>
        </Route>
      </Switch>
    </Section>
  );
};

export default DomainsList;
