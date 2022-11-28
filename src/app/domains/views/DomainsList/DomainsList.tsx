import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import DomainListHeader from "./DomainListHeader";
import DomainsTable from "./DomainsTable";

import MainContentSection from "app/base/components/MainContentSection";
import { useWindowTitle } from "app/base/hooks";
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
    <MainContentSection header={<DomainListHeader />}>
      {domains.length > 0 && <DomainsTable />}
    </MainContentSection>
  );
};

export default DomainsList;
