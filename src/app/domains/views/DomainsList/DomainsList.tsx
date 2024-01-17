import { useSelector } from "react-redux";

import DomainListHeader from "./DomainListHeader";
import DomainsTable from "./DomainsTable";

import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import DomainForm from "@/app/domains/components/DomainForm";
import { actions } from "@/app/store/domain";
import domainsSelectors from "@/app/store/domain/selectors";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

const DomainsList = (): JSX.Element => {
  const domains = useSelector(domainsSelectors.all);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("DNS");

  useFetchActions([actions.fetch]);

  return (
    <PageContent
      header={<DomainListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={
        sidePanelContent && (
          <DomainForm
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Domains", sidePanelContent)}
    >
      {domains.length > 0 && <DomainsTable />}
    </PageContent>
  );
};

export default DomainsList;
