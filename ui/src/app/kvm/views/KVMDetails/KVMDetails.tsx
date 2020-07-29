import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import Section from "app/base/components/Section";
import KVMConfiguration from "./KVMConfiguration";
import KVMDetailsHeader from "./KVMDetailsHeader";
import KVMSummary from "./KVMSummary";

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(podActions.get(id));
  }, [dispatch, id]);

  // If KVM has been deleted, redirect to KVM list.
  if (podsLoaded && !pod) {
    return <Redirect to="/kvm" />;
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
            <KVMConfiguration />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default KVMDetails;
