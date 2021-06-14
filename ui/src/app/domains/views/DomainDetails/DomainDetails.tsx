import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import DomainDetailsHeader from "./DomainDetailsHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import { actions as domainsActions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";
import type { RootState } from "app/store/root/types";

const DomainDetails = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );

  const dispatch = useDispatch();
  useWindowTitle(domain?.name ?? "Loading...");

  useEffect(() => {
    dispatch(domainsActions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<DomainDetailsHeader />}
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default DomainDetails;
