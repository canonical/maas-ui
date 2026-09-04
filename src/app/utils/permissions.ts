import type { EntitlementResponse } from "../apiclient";

export const hasPermissions = (
  current_entitlements: EntitlementResponse[] | undefined,
  required_entitlements: string[] | undefined
): boolean => {
  if (!required_entitlements || required_entitlements.length === 0) {
    return true;
  }

  if (!current_entitlements || current_entitlements.length === 0) {
    return false;
  }

  return required_entitlements.every((entitlement) => {
    // If the user has the edit entitlement, they also have the view entitlement
    const editEquivalent = entitlement.replace(/^can_view_/, "can_edit_");
    return current_entitlements.some(
      (current) =>
        current.entitlement === entitlement ||
        current.entitlement === editEquivalent
    );
  });
};

// Checks whether the user holds an entitlement scoped to a particular pool.
export const hasEntitlementForPool = (
  current_entitlements: EntitlementResponse[] | undefined,
  entitlement: string,
  poolId: number
): boolean => {
  if (!current_entitlements || current_entitlements.length === 0) {
    return false;
  }

  const editEquivalent = entitlement.replace(/^can_view_/, "can_edit_");
  return current_entitlements.some(
    (current) =>
      (current.entitlement === entitlement ||
        current.entitlement === editEquivalent) &&
      (current.resource_type === "maas" ||
        (current.resource_type === "pool" && current.resource_id === poolId))
  );
};
