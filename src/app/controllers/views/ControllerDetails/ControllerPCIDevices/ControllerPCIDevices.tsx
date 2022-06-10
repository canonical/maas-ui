import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NodeDevices from "app/base/components/node/NodeDevices";
import { useWindowTitle } from "app/base/hooks";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import { isControllerDetails } from "app/store/controller/utils";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const ControllerPCIDevices = ({ systemId }: Props): JSX.Element => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  useWindowTitle(`${`${controller?.hostname}` || "Controller"} PCI devices`);

  if (isControllerDetails(controller)) {
    return <NodeDevices bus={NodeDeviceBus.PCIE} node={controller} />;
  }
  return <Spinner aria-label="Loading controller" text="Loading..." />;
};

export default ControllerPCIDevices;
