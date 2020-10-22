import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import { machine as machineActions } from "app/base/actions";
import MachineHeader from "./MachineHeader";
import machineSelectors from "app/store/machine/selectors";
import MachineSummary from "./MachineSummary";
import Section from "app/base/components/Section";
import type { RootState } from "app/store/root/types";

type RouteParams = {
  id: string;
};

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  return (
    <Section header={<MachineHeader />} headerClassName="u-no-padding--bottom">
      {machine && (
        <Switch>
          <Route exact path="/machine/:id">
            <MachineSummary />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default MachineDetails;
