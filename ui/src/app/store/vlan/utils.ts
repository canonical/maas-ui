import type { Fabric } from "app/store/fabric/types";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { VLAN } from "app/store/vlan/types";
import { VlanVid } from "app/store/vlan/types";

/**
 * Get the VLAN display text.
 * @param vlan - A VLAN.
 * @return The VLAN display text.
 */
export const getVLANDisplay = (
  vlan: VLAN | null | undefined
): string | null => {
  if (!vlan) {
    return null;
  }
  if (vlan.vid === VlanVid.UNTAGGED) {
    return "untagged";
  } else if (vlan.name) {
    return `${vlan.vid} (${vlan.name})`;
  } else {
    return vlan.vid.toString();
  }
};

/**
 * Get the text full name for a VLAN.
 * @param vlanId - A VLAN's id.
 * @return A VLAN's full name.
 */
export const getFullVLANName = (
  vlanId: VLAN["id"],
  vlans: VLAN[],
  fabrics: Fabric[]
): string | null => {
  const vlan = vlans.find(({ id }) => id === vlanId);
  if (!vlan) {
    return null;
  }
  const fabric = fabrics.find(({ id }) => id === vlan.fabric);
  if (!fabric) {
    return null;
  }
  return `${getFabricDisplay(fabric)}.${getVLANDisplay(vlan)}`;
};

/**
 * Get the text for the link mode of the interface.
 * @param nic - A network interface.
 * @return The display text for a link mode.
 */
export const getDHCPStatus = (
  vlan: VLAN | null | undefined,
  vlans: VLAN[],
  fabrics: Fabric[],
  fullName = false
): string => {
  if (vlan?.external_dhcp) {
    return `External (${vlan.external_dhcp})`;
  }
  if (vlan?.dhcp_on) {
    return "MAAS-provided";
  }
  if (vlan?.relay_vlan) {
    if (fullName) {
      return `Relayed via ${getFullVLANName(vlan.relay_vlan, vlans, fabrics)}`;
    } else {
      return "Relayed";
    }
  }
  return "No DHCP";
};
