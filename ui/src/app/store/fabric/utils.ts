import type { Fabric } from "app/store/fabric/types";

/**
 * Get the Fabric display text.
 * @param vlan - A VLAN.
 * @return The VLAN display text.
 */
export const getFabricDisplay = (
  fabric: Fabric | null | undefined
): string | null => {
  if (!fabric) {
    return null;
  }
  if (fabric.name) {
    return fabric.name;
  } else {
    return `fabric-${fabric.id}`;
  }
};
