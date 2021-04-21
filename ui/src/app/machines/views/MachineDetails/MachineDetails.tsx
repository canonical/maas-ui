import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";

import MachineComissioning from "./MachineCommissioning";
import MachineConfiguration from "./MachineConfiguration";
import MachineHeader from "./MachineHeader";
import MachineInstances from "./MachineInstances";
import MachineLogs from "./MachineLogs";
import MachineNetwork from "./MachineNetwork";
import NetworkNotifications from "./MachineNetwork/NetworkNotifications";
import MachinePCIDevices from "./MachinePCIDevices";
import MachineStorage from "./MachineStorage";
import StorageNotifications from "./MachineStorage/StorageNotifications";
import MachineSummary from "./MachineSummary";
import SummaryNotifications from "./MachineSummary/SummaryNotifications";
import MachineTests from "./MachineTests";
import MachineTestsDetails from "./MachineTests/MachineTestsDetails/MachineTestsDetails";
import MachineUSBDevices from "./MachineUSBDevices";
import type { SelectedAction } from "./types";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { pathname } = useLocation();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(
    null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    dispatch(machineActions.get(id));
    // Set machine as active to ensure all machine data is sent from the server.
    dispatch(machineActions.setActive(id));

    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
      // Clean up any machine errors etc. when closing the details.
      dispatch(machineActions.cleanup());
    };
  }, [dispatch, id]);

  // Display a message if the machine does not exist.
  if (!machinesLoading && !machine) {
    return (
      <Section header="Machine not found" data-test="not-found">
        <p>
          This machine could not be found.{" "}
          <Link to="/machines">View all machines</Link>.
        </p>
      </Section>
    );
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
      {machine && (
        <Switch>
          <Route exact path="/machine/:id/summary">
            <SummaryNotifications id={id} />
            <MachineSummary setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path="/machine/:id/instances">
            <MachineInstances />
          </Route>
          <Route exact path="/machine/:id/network">
            <NetworkNotifications id={id} />
            <MachineNetwork setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path="/machine/:id/storage">
            <StorageNotifications id={id} />
            <MachineStorage />
          </Route>
          <Route exact path="/machine/:id/pci-devices">
            <MachinePCIDevices setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path="/machine/:id/usb-devices">
            <MachineUSBDevices setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path="/machine/:id/commissioning">
            <MachineComissioning />
          </Route>
          <Route
            exact
            path="/machine/:id/commissioning/:scriptResultId/details"
          >
            <MachineTestsDetails />
          </Route>
          <Route exact path="/machine/:id/testing">
            <MachineTests />
          </Route>
          <Route exact path="/machine/:id/testing/:scriptResultId/details">
            <MachineTestsDetails />
          </Route>
          <Route path="/machine/:id/logs">
            <MachineLogs systemId={id} />
          </Route>
          <Route exact path="/machine/:id/events">
            <Redirect to={`/machine/${id}/logs/events`} />
          </Route>
          <Route exact path="/machine/:id/configuration">
            <MachineConfiguration />
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
