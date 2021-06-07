import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

const DomainListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={[
        <Button appearance="neutral" data-test="add-domain" key="add-domain">
          Add domains
        </Button>,
      ]}
      loading={!domainsLoaded}
      subtitle={`${pluralize("domain", domains, true)} available`}
      title="DNS"
    />
  );
};

export default DomainListHeader;
