import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import { DomainListSidePanelViews } from "../constants";

import SectionHeader from "app/base/components/SectionHeader";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

export enum Labels {
  AddDomains = "Add domains",
}

const DomainListHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): JSX.Element => {
  const dispatch = useDispatch();
  const domainCount = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);

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

  return (
    <SectionHeader
      buttons={buttons}
      subtitle={`${pluralize("domain", domainCount, true)} available`}
      subtitleLoading={!domainsLoaded}
      title="DNS"
    />
  );
};

export default DomainListHeader;
