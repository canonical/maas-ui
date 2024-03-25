import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

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

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import NodeTestDetails from "@/app/base/components/node/NodeTestDetails";
import { useGetURLId } from "@/app/base/hooks/urls";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import MachineForms from "@/app/machines/components/MachineForms";
import { machineActions } from "@/app/store/machine";
import { MachineMeta } from "@/app/store/machine/types";
import { useFetchMachine } from "@/app/store/machine/utils/hooks";
import { tagActions } from "@/app/store/tag";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { getRelativeRoute, isId } from "@/app/utils";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);
  const { pathname } = useLocation();
  const { machine, loaded: detailsLoaded } = useFetchMachine(id);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

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
    <PageContent
      header={
        <MachineHeader
          setSidePanelContent={setSidePanelContent}
          systemId={id}
        />
      }
      sidePanelContent={
        sidePanelContent && machine ? (
          <MachineForms
            searchFilter=""
            selectedCount={1}
            selectedMachines={{ items: [machine.system_id] }}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
            viewingDetails
          />
        ) : null
      }
      sidePanelTitle={
        machine && getSidePanelTitle(machine.hostname, sidePanelContent)
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
                <MachineSummary setSidePanelContent={setSidePanelContent} />
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
                <MachineNetwork
                  id={id}
                  setSidePanelContent={setSidePanelContent}
                />
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
            element={
              <MachinePCIDevices setSidePanelContent={setSidePanelContent} />
            }
            path={getRelativeRoute(
              urls.machines.machine.pciDevices(null),
              base
            )}
          />
          <Route
            element={
              <MachineUSBDevices setSidePanelContent={setSidePanelContent} />
            }
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
    </PageContent>
  );
};

export default MachineDetails;
