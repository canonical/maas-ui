import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DHCPTable from "app/base/components/DHCPTable";
import NodeNetworkTab from "app/base/components/NodeNetworkTab";
import { useWindowTitle } from "app/base/hooks";
import controllerSelectors from "app/store/controller/selectors";
import { ControllerMeta } from "app/store/controller/types";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const ControllerNetwork = ({ systemId }: Props): JSX.Element => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  useWindowTitle(`${`${controller?.hostname}` || "Controller"} network`);

  if (!controller) {
    return <Spinner aria-label="Loading controller" text="Loading..." />;
  }

  return (
    <NodeNetworkTab
      aria-label="Controller network"
      dhcpTable={() => (
        <DHCPTable
          className="u-no-padding--top"
          node={controller}
          modelName={ControllerMeta.MODEL}
        />
      )}
      interfaceTable={
        // TODO: implement the interfaces table.
        () => <></>
      }
    />
  );
};

export default ControllerNetwork;
