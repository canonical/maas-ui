import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import DomainListHeader from "./DomainListHeader";
import DomainsTable from "./DomainsTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";
import { actions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";

const DomainsList = (): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainsSelectors.all);

  useWindowTitle("DNS");

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section header={<DomainListHeader />}>
      <Switch>
        <Route
          exact
          path={urls.domains.index}
          render={() => <>{domains.length > 0 && <DomainsTable />}</>}
        />
      </Switch>
    </Section>
  );
};

export default DomainsList;
