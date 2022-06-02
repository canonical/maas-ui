import { Tabs } from "@canonical/react-components";
import { Route, useLocation } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import DownloadMenu from "./DownloadMenu";
import EventLogs from "./EventLogs";
import InstallationOutput from "./InstallationOutput";

import machineURLs from "app/machines/urls";
import type { Controller } from "app/store/controller/types";
import type { Machine } from "app/store/machine/types";

type Props = { node: Machine | Controller };

export enum Label {
  Loading = "Loading logs",
}

const NodeLogs = ({ node }: Props): JSX.Element => {
  const { pathname } = useLocation();

  const showingOutput = pathname.startsWith(
    machineURLs.machine.logs.installationOutput({ id: node.system_id })
  );
  return (
    <>
      <div className="u-position--relative">
        <Tabs
          links={[
            {
              active:
                pathname.startsWith(
                  machineURLs.machine.logs.events({ id: node.system_id })
                ) || !showingOutput,
              component: Link,
              label: "Event log",
              to: machineURLs.machine.logs.events({ id: node.system_id }),
            },
            {
              active: showingOutput,
              component: Link,
              label: "Installation output",
              to: machineURLs.machine.logs.installationOutput({
                id: node.system_id,
              }),
            },
          ]}
        />
        <DownloadMenu systemId={node.system_id} />
      </div>
      <Route
        exact
        path={machineURLs.machine.logs.installationOutput(null, true)}
        render={() => <InstallationOutput systemId={node.system_id} />}
      />
      {[
        machineURLs.machine.logs.index(null, true),
        machineURLs.machine.logs.events(null, true),
      ].map((path) => (
        <Route
          exact
          key={path}
          path={path}
          render={() => <EventLogs systemId={node.system_id} />}
        />
      ))}
    </>
  );
};

export default NodeLogs;
