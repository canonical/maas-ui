import type { Domain, DomainDetails } from "./types";

/**
 * Wether a domain has a DomainDetails type.
 * @param domain - The domain to check
 * @returns Whether the domain is DomainDetails.
 */
export const isDomainDetails = (
  domain?: Domain | null
  // Use "rrsets" as the canary as it only exists for DomainDetails.
): domain is DomainDetails => !!domain && "rrsets" in domain;
