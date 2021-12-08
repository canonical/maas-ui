import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import type { NetworkInterface, NetworkLink, Node } from "app/store/types/node";
import { getInterfaceFabric, isBondOrBridgeParent } from "app/store/utils";
import vlanSelectors from "app/store/vlan/selectors";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  node: Node;
};

const FabricColumn = ({ link, nic, node }: Props): JSX.Element | null => {
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const fabrics = useSelector(fabricSelectors.all);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const vlans = useSelector(vlanSelectors.all);
  if (!node) {
    return null;
  }
  if (!fabricsLoaded) {
    return <Spinner />;
  }
  const isABondOrBridgeParent = isBondOrBridgeParent(node, nic, link);
  const fabric = getInterfaceFabric(node, fabrics, vlans, nic, link);
  const fabricContent = !isABondOrBridgeParent
    ? fabric?.name || "Disconnected"
    : null;

  return (
    <DoubleRow
      data-testid="fabric"
      primary={
        fabric ? (
          <LegacyLink
            className="p-link--soft"
            route={baseURLs.fabric({ id: fabric.id })}
          >
            {fabricContent}
          </LegacyLink>
        ) : (
          fabricContent
        )
      }
      secondary={
        vlan ? (
          <LegacyLink
            className="p-link--muted"
            route={baseURLs.vlan({ id: vlan.id })}
          >
            {getVLANDisplay(vlan)}
          </LegacyLink>
        ) : null
      }
    />
  );
};

export default FabricColumn;
