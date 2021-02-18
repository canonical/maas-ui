import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import fabricSelectors from "app/store/fabric/selectors";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getInterfaceFabric,
  isBondOrBridgeParent,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const FabricColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const fabrics = useSelector(fabricSelectors.all);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const vlans = useSelector(vlanSelectors.all);
  if (!machine) {
    return null;
  }
  if (!fabricsLoaded) {
    return <Spinner />;
  }
  const isABondOrBridgeParent = isBondOrBridgeParent(machine, nic, link);
  const fabric = getInterfaceFabric(machine, fabrics, vlans, nic, link);
  const fabricContent = !isABondOrBridgeParent
    ? fabric?.name || "Disconnected"
    : null;

  return (
    <DoubleRow
      data-test="fabric"
      primary={
        fabric ? (
          <LegacyLink className="p-link--soft" route={`/fabric/${fabric.id}`}>
            {fabricContent}
          </LegacyLink>
        ) : (
          fabricContent
        )
      }
      secondary={
        vlan ? (
          <LegacyLink className="p-link--muted" route={`/vlan/${vlan.id}`}>
            {getVLANDisplay(vlan)}
          </LegacyLink>
        ) : null
      }
    />
  );
};

export default FabricColumn;
