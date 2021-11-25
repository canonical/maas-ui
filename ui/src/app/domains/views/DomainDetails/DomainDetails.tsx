import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import DomainDetailsHeader from "./DomainDetailsHeader";
import DomainSummary from "./DomainSummary/DomainSummary";
import ResourceRecords from "./ResourceRecords";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import domainURLs from "app/domains/urls";
import { actions as domainsActions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";
import type { RootState } from "app/store/root/types";

const DomainDetails = (): JSX.Element => {
  const id = Number(useParams<RouteParams>().id);
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );
  const domainsLoading = useSelector(domainsSelectors.loading);

  const dispatch = useDispatch();
  useWindowTitle(domain?.name ?? "Loading...");

  useEffect(() => {
    dispatch(domainsActions.get(id));
    // Set domain as active to ensure all domain data is sent from the server.
    dispatch(domainsActions.setActive(id));

    // Unset active domain on cleanup.
    return () => {
      dispatch(domainsActions.setActive(null));
    };
  }, [dispatch, id]);

  if (!domainsLoading && !domain) {
    return (
      <ModelNotFound id={id} linkURL={domainURLs.domains} modelName="domain" />
    );
  }
  return (
    <Section header={<DomainDetailsHeader id={id} />}>
      <DomainSummary id={id} />
      <ResourceRecords id={id} />
    </Section>
  );
};

export default DomainDetails;
