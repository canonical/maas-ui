import { Spinner, Tabs } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link, Route, useLocation } from "react-router-dom";

import EventLogs from "./EventLogs";

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

  return (
    <>
      <Tabs
        links={[
          {
            active: pathname.startsWith(`${urlBase}/events`),
            component: Link,
            label: "Event log",
            to: `${urlBase}/events`,
          },
          {
            active: pathname.startsWith(`${urlBase}/installation-output`),
            component: Link,
            label: "Installation output",
            to: `${urlBase}/installation-output`,
          },
        ]}
      />

      <Route exact path="/machine/:id/logs/events">
        <EventLogs systemId={systemId} />
      </Route>
    </>
  );
};

export default MachineNetwork;
