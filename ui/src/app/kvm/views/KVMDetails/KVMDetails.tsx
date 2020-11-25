import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import KVMDetailsHeader from "./KVMDetailsHeader";
import KVMSummary from "./KVMSummary";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import PodConfiguration from "app/kvm/components/PodConfiguration";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(podActions.get(Number(id)));
    // Set KVM as active to ensure all KVM data is sent from the server.
    dispatch(podActions.setActive(Number(id)));

    // Unset active KVM on cleanup.
    return () => {
      dispatch(podActions.setActive(null));
    };
  }, [dispatch, id]);

  // If KVM has been deleted, redirect to KVM list.
  if (podsLoaded && !pod) {
    return <Redirect to="/kvm" />;
  }

  // If pod is an RSD, redirect to RSD details page.
  if (pod?.type === "rsd") {
    return <Redirect to={`/rsd/${id}`} />;
  }

  return (
    <Section
      header={<KVMDetailsHeader />}
      headerClassName="u-no-padding--bottom"
    >
      {pod && (
        <Switch>
          <Route exact path="/kvm/:id">
            <KVMSummary />
          </Route>
          <Route exact path="/kvm/:id/edit">
            <PodConfiguration />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default KVMDetails;
