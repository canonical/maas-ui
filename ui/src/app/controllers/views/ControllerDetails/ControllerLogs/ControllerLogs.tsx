import { useSelector } from "react-redux";

import { useWindowTitle } from "app/base/hooks";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const ControllerLogs = ({ systemId }: Props): JSX.Element => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  useWindowTitle(`${`${controller?.hostname}` || "Controller"} logs`);

  return <h4>Controller logs</h4>;
};

export default ControllerLogs;
