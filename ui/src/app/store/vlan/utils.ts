import type { VLAN } from "app/store/vlan/types";

/**
 * Get the VLAN display text.
 * @param vlan - A VLAN.
 * @return The VLAN display text.
 */
export const getVLANDisplay = (vlan: VLAN | null): string | null => {
  if (!vlan) {
    return null;
  }
  if (vlan.vid === 0) {
    return "untagged";
  } else if (vlan.name) {
    return `${vlan.vid} (${vlan.name})`;
  } else {
    return vlan.vid.toString();
  }
};
