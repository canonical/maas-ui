import type { Subnet, SubnetDetails } from "app/store/subnet/types";

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

/**
 * Returns whether a subnet is of type SubnetDetails.
 * @param subnet - The subnet to check.
 * @returns Whether the subnet is of type SubnetDetails.
 */
export const isSubnetDetails = (
  subnet?: Subnet | null
): subnet is SubnetDetails => !!subnet && "ip_addresses" in subnet;
