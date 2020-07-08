import { useSelector } from "react-redux";

import controllerSelectors from "app/store/controller/selectors";
import deviceSelectors from "app/store/device/selectors";
import machineSelectors from "app/store/machine/selectors";
import subnetSelectors from "app/store/subnet/selectors";

export const useDhcpTarget = (nodeId, subnetId) => {
  const subnetLoading = useSelector(subnetSelectors.loading);
  const subnetLoaded = useSelector(subnetSelectors.loaded);
  const subnet = useSelector((state) =>
    subnetSelectors.getById(state, subnetId)
  );
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const controller = useSelector((state) =>
    controllerSelectors.getBySystemId(state, nodeId)
  );
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const device = useSelector((state) =>
    deviceSelectors.getBySystemId(state, nodeId)
  );
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, nodeId)
  );
  const isLoading =
    (subnetId && subnetLoading) ||
    (nodeId && (controllerLoading || deviceLoading || machineLoading));
  const hasLoaded =
    (subnetId && subnetLoaded) ||
    (nodeId && controllerLoaded && deviceLoaded && machineLoaded);

  return {
    loading: isLoading,
    loaded: hasLoaded,
    target: subnet || machine || device || controller,
    type:
      (subnet && "subnet") ||
      (controller && "controller") ||
      (device && "device") ||
      (machine && "machine"),
  };
};
