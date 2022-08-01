import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom-v5-compat";

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
import { useGetMachine } from "app/store/machine/utils/hooks";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { getRelativeRoute, isId } from "app/utils";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);
  const { pathname } = useLocation();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const requestId = useGetMachine(id);
  const detailsLoaded = useSelector((state: RootState) =>
    machineSelectors.detailsLoaded(state, requestId)
  );
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isId(id)) {
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

  if (!isId(id) || (detailsLoaded && !machine)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={urls.machines.index}
        modelName="machine"
      />
    );
  }

  const base = urls.machines.machine.index(null);

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
        <Routes>
          <Route
            element={<Redirect to={urls.machines.machine.summary({ id })} />}
            index
          />
          <Route
            element={
              <>
                <SummaryNotifications id={id} />
                <MachineSummary setHeaderContent={setHeaderContent} />
              </>
            }
            path={getRelativeRoute(urls.machines.machine.summary(null), base)}
          />
          <Route
            element={<MachineInstances />}
            path={getRelativeRoute(urls.machines.machine.instances(null), base)}
          />
          <Route
            element={
              <>
                <NetworkNotifications id={id} />
                <MachineNetwork id={id} setHeaderContent={setHeaderContent} />
              </>
            }
            path={getRelativeRoute(urls.machines.machine.network(null), base)}
          />
          <Route
            element={
              <>
                <StorageNotifications id={id} />
                <MachineStorage />
              </>
            }
            path={getRelativeRoute(urls.machines.machine.storage(null), base)}
          />
          <Route
            element={<MachinePCIDevices setHeaderContent={setHeaderContent} />}
            path={getRelativeRoute(
              urls.machines.machine.pciDevices(null),
              base
            )}
          />
          <Route
            element={<MachineUSBDevices setHeaderContent={setHeaderContent} />}
            path={getRelativeRoute(
              urls.machines.machine.usbDevices(null),
              base
            )}
          />
          <Route
            element={<MachineCommissioning />}
            path={getRelativeRoute(
              urls.machines.machine.commissioning.index(null),
              base
            )}
          />
          <Route
            element={
              <NodeTestDetails
                getReturnPath={(id) =>
                  urls.machines.machine.commissioning.index({ id })
                }
              />
            }
            path={getRelativeRoute(
              urls.machines.machine.commissioning.scriptResult(null),
              base
            )}
          />
          <Route
            element={<MachineTests />}
            path={getRelativeRoute(
              urls.machines.machine.testing.index(null),
              base
            )}
          />
          <Route
            element={
              <NodeTestDetails
                getReturnPath={(id) =>
                  urls.machines.machine.testing.index({ id })
                }
              />
            }
            path={getRelativeRoute(
              urls.machines.machine.testing.scriptResult(null),
              base
            )}
          />
          <Route
            element={<MachineLogs systemId={id} />}
            path={getRelativeRoute(
              `${urls.machines.machine.logs.index(null)}/*`,
              base
            )}
          />
          <Route
            element={
              <Redirect to={urls.machines.machine.logs.events({ id })} />
            }
            path={getRelativeRoute(urls.machines.machine.events(null), base)}
          />
          <Route
            element={<MachineConfiguration />}
            path={getRelativeRoute(
              urls.machines.machine.configuration(null),
              base
            )}
          />
          <Route
            element={<Redirect to={urls.machines.machine.summary({ id })} />}
            path={base}
          />
        </Routes>
      )}
    </Section>
  );
};

export default MachineDetails;
