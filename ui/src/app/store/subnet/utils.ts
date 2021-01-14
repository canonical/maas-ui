import type { Subnet } from "app/store/subnet/types";

/**
 * Get the Subnet display text.
 * @param subnet - A subnet.
 * @return The subnet display text.
 */
export const getSubnetDisplay = (
  subnet: Subnet | null | undefined,
  short?: boolean
): string => {
  if (!subnet) {
    return "Unconfigured";
  } else if (!short && subnet.cidr !== subnet.name) {
    return `${subnet.cidr} (${subnet.name})`;
  } else {
    return subnet.cidr;
  }
};
