import type { ReactNode } from "react";

import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import fabricSelectors from "app/store/fabric/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { NetworkInterface, Machine } from "app/store/machine/types";
import { useIsAllNetworkingDisabled } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";
import vlanSelectors from "app/store/vlan/selectors";

type Props = { nic: NetworkInterface; systemId: Machine["system_id"] };

const SubnetColumn = ({ nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, vlan?.fabric)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const discoveredSubnetId =
    nic?.discovered?.length && nic.discovered.length > 0
      ? nic.discovered[0].subnet_id
      : null;
  const showSubnetLinks = fabric && !discoveredSubnetId;
  const showSubnetDisplay = isAllNetworkingDisabled && discoveredSubnetId;
  let subnetId: Subnet["id"] | null | undefined;
  if (showSubnetLinks) {
    // Look for a link to a subnet.
    const subnetLink = nic?.links.find(
      ({ subnet_id }) => subnet_id !== undefined && subnet_id !== null
    );
    subnetId = subnetLink?.subnet_id;
  } else if (showSubnetDisplay) {
    subnetId = discoveredSubnetId;
  }
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );

  if (!showSubnetLinks && !showSubnetDisplay) {
    return null;
  }

  let primary: ReactNode = null;
  if (showSubnetLinks) {
    primary = subnet?.cidr ? (
      <LegacyLink className="p-link--soft" route={`/subnet/${subnet.id}`}>
        {subnet.cidr}
      </LegacyLink>
    ) : (
      "Unconfigured"
    );
  } else if (showSubnetDisplay) {
    primary = getSubnetDisplay(subnet);
  }

  return (
    <DoubleRow
      primary={primary}
      secondary={
        showSubnetLinks && subnet ? (
          <LegacyLink className="p-link--muted" route={`/subnet/${subnet.id}`}>
            {subnet.name}
          </LegacyLink>
        ) : null
      }
    />
  );
};

export default SubnetColumn;
