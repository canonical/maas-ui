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
    const editEquivalent = entitlement.replace(/^can_view_/, "can_edit_");
    return current_entitlements.some(
      (current) =>
        current.entitlement === entitlement ||
        current.entitlement === editEquivalent
    );
  });
};
