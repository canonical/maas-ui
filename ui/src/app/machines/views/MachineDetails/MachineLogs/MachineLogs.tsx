import { Spinner, Tabs } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link, Route, useLocation } from "react-router-dom";

import DownloadMenu from "./DownloadMenu";
import EventLogs from "./EventLogs";
import InstallationOutput from "./InstallationOutput";

import { useWindowTitle } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const MachineNetwork = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { pathname } = useLocation();
  const urlBase = `/machine/${systemId}/logs`;

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} logs`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  const showingOutput = pathname.startsWith(`${urlBase}/installation-output`);
  return (
    <>
      <div className="u-flex">
        <Tabs
          className="u-flex--grow"
          links={[
            {
              active:
                pathname.startsWith(`${urlBase}/events`) || !showingOutput,
              component: Link,
              label: "Event log",
              to: `${urlBase}/events`,
            },
            {
              active: showingOutput,
              component: Link,
              label: "Installation output",
              to: `${urlBase}/installation-output`,
            },
          ]}
        />
        <DownloadMenu />
      </div>
      <Route exact path="/machine/:id/logs/events">
        <EventLogs systemId={systemId} />
      </Route>
      <Route exact path="/machine/:id/logs/installation-output">
        <InstallationOutput systemId={systemId} />
      </Route>
      <Route exact path={["/machine/:id/logs", "/machine/:id/logs/events"]}>
        <EventLogs systemId={systemId} />
      </Route>
    </>
  );
};

export default MachineNetwork;
