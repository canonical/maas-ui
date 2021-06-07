import { Route, Switch } from "react-router-dom";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useWindowTitle } from "app/base/hooks";
import domainsURLs from "app/domains/urls";

const DomainsList = (): JSX.Element => {
  useWindowTitle("DNS");

  return (
    <Section
      header={<SectionHeader title="DNS" subtitle="Work in progress..." />}
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
