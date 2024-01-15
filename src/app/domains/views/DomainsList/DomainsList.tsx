import { useSelector } from "react-redux";

import DomainListHeader from "./DomainListHeader";
import DomainListHeaderForm from "./DomainListHeaderForm";
import DomainsTable from "./DomainsTable";
import { DomainListSidePanelViews } from "./constants";

import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { actions } from "@/app/store/domain";
import domainsSelectors from "@/app/store/domain/selectors";

const DomainsList = (): JSX.Element => {
  const domains = useSelector(domainsSelectors.all);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  let content: JSX.Element | null = null;

  if (sidePanelContent?.view === DomainListSidePanelViews.ADD_DOMAIN) {
    content = (
      <DomainListHeaderForm
        closeForm={() => {
          setSidePanelContent(null);
        }}
      />
    );
  }

  useWindowTitle("DNS");

  useFetchActions([actions.fetch]);

  return (
    <PageContent
      header={<DomainListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle={"Add domains"}
    >
      {domains.length > 0 && <DomainsTable />}
    </PageContent>
  );
};

export default DomainsList;
