import { Spinner, Tabs } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link, Route, useLocation } from "react-router-dom";

import DownloadMenu from "./DownloadMenu";
import EventLogs from "./EventLogs";
import InstallationOutput from "./InstallationOutput";

import { useWindowTitle } from "app/base/hooks";
import machineURLs from "app/machines/urls";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const MachineNetwork = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { pathname } = useLocation();

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} logs`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  const showingOutput = pathname.startsWith(
    machineURLs.machine.logs.installationOutput({ id: systemId })
  );
  return (
    <>
      <div className="u-flex">
        <Tabs
          className="u-flex--grow"
          links={[
            {
              active:
                pathname.startsWith(
                  machineURLs.machine.logs.events({ id: systemId })
                ) || !showingOutput,
              component: Link,
              label: "Event log",
              to: machineURLs.machine.logs.events({ id: systemId }),
            },
            {
              active: showingOutput,
              component: Link,
              label: "Installation output",
              to: machineURLs.machine.logs.installationOutput({ id: systemId }),
            },
          ]}
        />
        <DownloadMenu systemId={systemId} />
      </div>
      <Route
        exact
        path={machineURLs.machine.logs.installationOutput(null, true)}
        component={() => <InstallationOutput systemId={systemId} />}
      />
      {[
        machineURLs.machine.logs.index(null, true),
        machineURLs.machine.logs.events(null, true),
      ].map((path) => (
        <Route
          exact
          key={path}
          path={path}
          component={() => <EventLogs systemId={systemId} />}
        />
      ))}
    </>
  );
};

export default MachineNetwork;
