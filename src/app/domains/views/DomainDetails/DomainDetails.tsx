import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import DomainDetailsHeader from "./DomainDetailsHeader";
import AddRecordForm from "./DomainDetailsHeader/AddRecordForm";
import DeleteDomainForm from "./DomainDetailsHeader/DeleteDomainForm";
import { Labels } from "./DomainDetailsHeader/DomainDetailsHeader";
import DomainSummary from "./DomainSummary/DomainSummary";
import ResourceRecords from "./ResourceRecords";
import type { DomainDetailsSidePanelContent } from "./constants";
import { DomainDetailsSidePanelViews } from "./constants";

import ModelNotFound from "app/base/components/ModelNotFound";
import PageContent from "app/base/components/PageContent";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { SidePanelContextType } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import urls from "app/base/urls";
import { actions as domainsActions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";
import { DomainMeta } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const DomainDetails = (): JSX.Element => {
  const id = useGetURLId(DomainMeta.PK);
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );
  const domainsLoading = useSelector(domainsSelectors.loading);
  const { sidePanelContent, setSidePanelContent } =
    useSidePanel() as SidePanelContextType<DomainDetailsSidePanelContent>;

  const dispatch = useDispatch();
  useWindowTitle(domain?.name ?? "Loading...");

  useEffect(() => {
    if (isId(id)) {
      dispatch(domainsActions.get(id));
      // Set domain as active to ensure all domain data is sent from the server.
      dispatch(domainsActions.setActive(id));
    }
    // Unset active domain on cleanup.
    return () => {
      dispatch(domainsActions.setActive(null));
    };
  }, [dispatch, id]);

  if (!isId(id) || (!domainsLoading && !domain)) {
    return (
      <ModelNotFound id={id} linkURL={urls.domains.index} modelName="domain" />
    );
  }

  const closeForm = () => {
    setSidePanelContent(null);
  };

  let content = null;
  let title = null;

  if (sidePanelContent) {
    if (sidePanelContent.view === DomainDetailsSidePanelViews.ADD_RECORD) {
      content = <AddRecordForm closeForm={closeForm} id={id} />;
      title = Labels.AddRecord;
    } else if (
      sidePanelContent.view === DomainDetailsSidePanelViews.DELETE_DOMAIN
    ) {
      content = <DeleteDomainForm closeForm={closeForm} id={id} />;
      title = Labels.DeleteDomain;
    }
  }

  return (
    <PageContent
      header={
        <DomainDetailsHeader
          id={id}
          setSidePanelContent={setSidePanelContent}
        />
      }
      sidePanelContent={content}
      sidePanelTitle={title}
    >
      <DomainSummary id={id} />
      <ResourceRecords id={id} />
    </PageContent>
  );
};

export default DomainDetails;
