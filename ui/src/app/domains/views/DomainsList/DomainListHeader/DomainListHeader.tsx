import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import DomainListHeaderForm from "../DomainListHeaderForm";

import SectionHeader from "app/base/components/SectionHeader";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

const DomainListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const domainCount = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);

  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button
      appearance="neutral"
      data-test="add-domain"
      key="add-domain"
      onClick={() => setFormOpen(true)}
    >
      Add domains
    </Button>,
  ];

  let headerContent: JSX.Element | null = null;

  if (isFormOpen) {
    buttons = null;
    headerContent = (
      <DomainListHeaderForm
        closeForm={() => {
          setFormOpen(false);
        }}
      />
    );
  }
  return (
    <SectionHeader
      buttons={buttons}
      subtitle={`${pluralize("domain", domainCount, true)} available`}
      subtitleLoading={!domainsLoaded}
      title="DNS"
      headerContent={headerContent}
    />
  );
};

export default DomainListHeader;
