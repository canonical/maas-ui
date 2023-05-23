import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import DomainListHeaderForm from "../DomainListHeaderForm";
import { DomainListSidePanelViews } from "../constants";

import SectionHeader from "app/base/components/SectionHeader";
import { useSidePanel } from "app/base/side-panel-context";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

export enum Labels {
  AddDomains = "Add domains",
}

const DomainListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const domainCount = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button
      data-testid="add-domain"
      key="add-domain"
      onClick={() =>
        setSidePanelContent({ view: DomainListSidePanelViews.ADD_DOMAIN })
      }
    >
      {Labels.AddDomains}
    </Button>,
  ];

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
  return (
    <SectionHeader
      buttons={buttons}
      sidePanelContent={content}
      sidePanelTitle="Add domains"
      subtitle={`${pluralize("domain", domainCount, true)} available`}
      subtitleLoading={!domainsLoaded}
      title="DNS"
    />
  );
};

export default DomainListHeader;
