import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import MachineCommissioning from "./MachineCommissioning";
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

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import type { MachineHeaderContent } from "app/machines/types";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { isId } from "app/utils";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);
  const { pathname } = useLocation();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isId(id)) {
      dispatch(machineActions.get(id));
      // Set machine as active to ensure all machine data is sent from the server.
      dispatch(machineActions.setActive(id));
      dispatch(tagActions.fetch());
    }
    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
      // Clean up any machine errors etc. when closing the details.
      dispatch(machineActions.cleanup());
    };
  }, [dispatch, id]);

  if (!isId(id) || (!machinesLoading && !machine)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={machineURLs.machines.index}
        modelName="machine"
      />
    );
  }

  return (
    <Section
      header={
        <MachineHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          systemId={id}
        />
      }
    >
      {machine && (
        <Switch>
          <Route
            exact
            path={machineURLs.machine.summary(null, true)}
            render={() => (
              <>
                <SummaryNotifications id={id} />
                <MachineSummary setHeaderContent={setHeaderContent} />
              </>
            )}
          />
          <Route
            exact
            path={machineURLs.machine.instances(null, true)}
            render={() => <MachineInstances />}
          />
          <Route
            exact
            path={machineURLs.machine.network(null, true)}
            render={() => (
              <>
                <NetworkNotifications id={id} />
                <MachineNetwork id={id} setHeaderContent={setHeaderContent} />
              </>
            )}
          />
          <Route
            exact
            path={machineURLs.machine.storage(null, true)}
            render={() => (
              <>
                <StorageNotifications id={id} />
                <MachineStorage />
              </>
            )}
          />
          <Route
            exact
            path={machineURLs.machine.pciDevices(null, true)}
            render={() => (
              <MachinePCIDevices setHeaderContent={setHeaderContent} />
            )}
          />
          <Route
            exact
            path={machineURLs.machine.usbDevices(null, true)}
            render={() => (
              <MachineUSBDevices setHeaderContent={setHeaderContent} />
            )}
          />
          <Route
            exact
            path={machineURLs.machine.commissioning.index(null, true)}
            render={() => <MachineCommissioning />}
          />
          <Route
            exact
            path={machineURLs.machine.commissioning.scriptResult(null, true)}
            render={() => <MachineTestsDetails />}
          />
          <Route
            exact
            path={machineURLs.machine.testing.index(null, true)}
            render={() => <MachineTests />}
          />
          <Route
            exact
            path={machineURLs.machine.testing.scriptResult(null, true)}
            render={() => <MachineTestsDetails />}
          />
          <Route
            path={machineURLs.machine.logs.index(null, true)}
            render={() => <MachineLogs systemId={id} />}
          />
          <Route
            exact
            path={machineURLs.machine.events(null, true)}
            render={() => (
              <Redirect to={machineURLs.machine.logs.events({ id })} />
            )}
          />
          <Route
            exact
            path={machineURLs.machine.configuration(null, true)}
            render={() => <MachineConfiguration />}
          />
          <Route
            exact
            path={machineURLs.machine.index(null, true)}
            render={() => <Redirect to={machineURLs.machine.summary({ id })} />}
          />
        </Switch>
      )}
    </Section>
  );
};

export default MachineDetails;
