import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NodeLogs from "app/base/components/node/NodeLogs";
import { useWindowTitle } from "app/base/hooks";
import controllerURLs from "app/controllers/urls";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import { isControllerDetails } from "app/store/controller/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

export enum Label {
  Loading = "Loading logs",
}

const ControllerLogs = ({ systemId }: Props): JSX.Element => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  useWindowTitle(`${`${controller?.hostname}` || "Controller"} logs`);

  if (!controller || !isControllerDetails(controller)) {
    return <Spinner aria-label={Label.Loading} text="Loading..." />;
  }
  return (
    <NodeLogs
      node={controller}
      urls={{
        events: controllerURLs.controller.logs.events,
        index: controllerURLs.controller.logs.index,
        installationOutput: controllerURLs.controller.logs.installationOutput,
      }}
    />
  );
};

export default ControllerLogs;
