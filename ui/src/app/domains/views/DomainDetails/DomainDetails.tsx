import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
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

  useEffect(() => {
    dispatch(domainsActions.get(Number(id)));
    // TODO:
    // Set domain as active to ensure all domain data is sent from the server.
    // dispatch(domainsActions.setActive(Number(id)));

    // Unset active domain on cleanup.
    // return () => {
    //   dispatch(domainsActions.setActive(null));
    // };
  }, [dispatch, id]);

  return (
    <Section
      header={
        <SectionHeader
          title={domain ? domain.name : <Spinner text="Loading..." />}
        />
      }
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default DomainDetails;
