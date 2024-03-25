import { Tabs } from "@canonical/react-components";
import { Route, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import DownloadMenu from "./DownloadMenu";
import EventLogs from "./EventLogs";
import InstallationOutput from "./InstallationOutput";

import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import type { Node } from "@/app/store/types/node";

type GenerateURL = (
  args: { id: Node["system_id"] } | null,
  unmodified?: boolean
) => string;

type Props = {
  node: MachineDetails | ControllerDetails;
  urls: {
    events: GenerateURL;
    index: GenerateURL;
    installationOutput: GenerateURL;
  };
};

const NodeLogs = ({ node, urls }: Props): JSX.Element => {
  const { pathname } = useLocation();

  const showingOutput = pathname.startsWith(
    urls.installationOutput({ id: node.system_id })
  );
  return (
    <>
      <div className="u-position--relative">
        <Tabs
          links={[
            {
              active:
                pathname.startsWith(urls.events({ id: node.system_id })) ||
                !showingOutput,
              component: Link,
              label: "Event log",
              to: urls.events({ id: node.system_id }),
            },
            {
              active: showingOutput,
              component: Link,
              label: "Installation output",
              to: urls.installationOutput({ id: node.system_id }),
            },
          ]}
        />
        <DownloadMenu node={node} />
      </div>
      <Route
        exact
        path={urls.installationOutput(null)}
        render={() => <InstallationOutput node={node} />}
      />
      {[urls.index(null), urls.events(null)].map((path) => (
        <Route
          exact
          key={path}
          path={path}
          render={() => <EventLogs node={node} />}
        />
      ))}
    </>
  );
};

export default NodeLogs;
