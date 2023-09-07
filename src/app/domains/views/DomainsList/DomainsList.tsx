import { useSelector } from "react-redux";

import DomainListHeader from "./DomainListHeader";
import DomainsTable from "./DomainsTable";

import MainContentSection from "app/base/components/MainContentSection";
import { useFetchActions, useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";

const DomainsList = (): JSX.Element => {
  const domains = useSelector(domainsSelectors.all);

  useWindowTitle("DNS");

  useFetchActions([actions.fetch]);

  return (
    <MainContentSection header={<DomainListHeader />}>
      {domains.length > 0 && <DomainsTable />}
    </MainContentSection>
  );
};

export default DomainsList;
