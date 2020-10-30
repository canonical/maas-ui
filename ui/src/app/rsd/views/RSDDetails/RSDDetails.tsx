import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import Section from "app/base/components/Section";
import PodConfiguration from "app/kvm/components/PodConfiguration";
import RSDDetailsHeader from "./RSDDetailsHeader";
import RSDSummary from "./RSDSummary";

type RouteParams = {
  id: string;
};

const RSDDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(podActions.get(Number(id)));
    // Set RSD as active to ensure all RSD data is sent from the server.
    dispatch(podActions.setActive(Number(id)));

    // Unset active RSD on cleanup.
    return () => {
      dispatch(podActions.setActive(null));
    };
  }, [dispatch, id]);

  // If RSD has been deleted, redirect to RSD list.
  if (podsLoaded && !pod) {
    return <Redirect to="/rsd" />;
  }

  // If pod is not an RSD, redirect to KVM details page.
  if (pod?.type !== "rsd") {
    return <Redirect to={`/kvm/${id}`} />;
  }

  return (
    <Section
      header={<RSDDetailsHeader />}
      headerClassName="u-no-padding--bottom"
    >
      {pod && (
        <Switch>
          <Route exact path="/rsd/:id">
            <RSDSummary />
          </Route>
          <Route exact path="/rsd/:id/edit">
            <PodConfiguration />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default RSDDetails;
