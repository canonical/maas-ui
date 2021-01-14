import type { ReactNode } from "react";

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
  getInterfaceDiscovered,
  getInterfaceFabric,
  getInterfaceSubnet,
  getLinkInterface,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import { getSubnetDisplay } from "app/store/subnet/utils";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const SubnetColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);

  if (machine && link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }

  if (!machine || !subnetsLoaded) {
    return null;
  }

  const fabric = getInterfaceFabric(machine, fabrics, vlans, nic, link);
  const subnet = getInterfaceSubnet(
    machine,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    nic,
    link
  );
  const discovered = getInterfaceDiscovered(machine, nic, link);
  const discoveredSubnetId = discovered?.subnet_id || null;
  const showLinkSubnet = !!fabric && !discoveredSubnetId;
  const showDiscoveredSubnet = isAllNetworkingDisabled && discoveredSubnetId;
  const subnetDisplay = getSubnetDisplay(subnet, showLinkSubnet);
  let primary: ReactNode = null;
  if (showLinkSubnet) {
    primary = subnet ? (
      <LegacyLink className="p-link--soft" route={`/subnet/${subnet.id}`}>
        {subnetDisplay}
      </LegacyLink>
    ) : (
      subnetDisplay
    );
  } else if (showDiscoveredSubnet) {
    primary = subnetDisplay;
  } else {
    return null;
  }

  return (
    <DoubleRow
      primary={primary}
      secondary={
        showLinkSubnet && subnet ? (
          <LegacyLink className="p-link--muted" route={`/subnet/${subnet.id}`}>
            {subnet.name}
          </LegacyLink>
        ) : null
      }
    />
  );
};

export default SubnetColumn;
