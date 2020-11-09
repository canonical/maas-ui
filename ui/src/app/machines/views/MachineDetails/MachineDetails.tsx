import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect, useState } from "react";

import type { RouteParams } from "app/base/types";
import { machine as machineActions } from "app/base/actions";
import MachineHeader from "./MachineHeader";
import MachineNotifications from "./MachineNotifications";
import machineSelectors from "app/store/machine/selectors";
import MachineStorage from "./MachineStorage";
import MachineSummary, { SelectedAction } from "./MachineSummary";
import Section from "app/base/components/Section";
import type { RootState } from "app/store/root/types";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(
    null
  );

  useEffect(() => {
    dispatch(machineActions.get(id));
    // Set machine as active to ensure all machine data is sent from the server.
    dispatch(machineActions.setActive(id));

    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
    };
  }, [dispatch, id]);

  // If machine has been deleted, redirect to machine list.
  if (machinesLoaded && !machine) {
    return <Redirect to="/machines" />;
  }

  return (
    <Section
      header={
        <MachineHeader
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      <MachineNotifications />
      {machine && (
        <Switch>
          <Route exact path="/machine/:id/summary">
            <MachineSummary setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path="/machine/:id/storage">
            <MachineStorage />
          </Route>
          <Route exact path="/machine/:id">
            <Redirect to={`/machine/${id}/summary`} />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default MachineDetails;
