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
import MachineUSBDevices from "./MachineUSBDevices";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import NodeTestDetails from "app/base/components/node/NodeTestDetails";
import { useGetURLId } from "app/base/hooks/urls";
import urls from "app/base/urls";
import type { MachineHeaderContent } from "app/machines/types";
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
        linkURL={urls.machines.index}
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
            path={urls.machines.machine.summary(null)}
            render={() => (
              <>
                <SummaryNotifications id={id} />
                <MachineSummary setHeaderContent={setHeaderContent} />
              </>
            )}
          />
          <Route
            exact
            path={urls.machines.machine.instances(null)}
            render={() => <MachineInstances />}
          />
          <Route
            exact
            path={urls.machines.machine.network(null)}
            render={() => (
              <>
                <NetworkNotifications id={id} />
                <MachineNetwork id={id} setHeaderContent={setHeaderContent} />
              </>
            )}
          />
          <Route
            exact
            path={urls.machines.machine.storage(null)}
            render={() => (
              <>
                <StorageNotifications id={id} />
                <MachineStorage />
              </>
            )}
          />
          <Route
            exact
            path={urls.machines.machine.pciDevices(null)}
            render={() => (
              <MachinePCIDevices setHeaderContent={setHeaderContent} />
            )}
          />
          <Route
            exact
            path={urls.machines.machine.usbDevices(null)}
            render={() => (
              <MachineUSBDevices setHeaderContent={setHeaderContent} />
            )}
          />
          <Route
            exact
            path={urls.machines.machine.commissioning.index(null)}
            render={() => <MachineCommissioning />}
          />
          <Route
            exact
            path={urls.machines.machine.commissioning.scriptResult(null)}
            render={() => (
              <NodeTestDetails
                getReturnPath={(id) =>
                  urls.machines.machine.commissioning.index({ id })
                }
              />
            )}
          />
          <Route
            exact
            path={urls.machines.machine.testing.index(null)}
            render={() => <MachineTests />}
          />
          <Route
            exact
            path={urls.machines.machine.testing.scriptResult(null)}
            render={() => (
              <NodeTestDetails
                getReturnPath={(id) =>
                  urls.machines.machine.testing.index({ id })
                }
              />
            )}
          />
          <Route
            path={urls.machines.machine.logs.index(null)}
            render={() => <MachineLogs systemId={id} />}
          />
          <Route
            exact
            path={urls.machines.machine.events(null)}
            render={() => (
              <Redirect to={urls.machines.machine.logs.events({ id })} />
            )}
          />
          <Route
            exact
            path={urls.machines.machine.configuration(null)}
            render={() => <MachineConfiguration />}
          />
          <Route
            exact
            path={urls.machines.machine.index(null)}
            render={() => (
              <Redirect to={urls.machines.machine.summary({ id })} />
            )}
          />
        </Switch>
      )}
    </Section>
  );
};

export default MachineDetails;
