import type { EntitlementResponse } from "../apiclient";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

// Implications from the OpenFGA model that the generic view -> edit rule misses.
// The entitlements endpoint returns raw grants, so the UI must expand them.
const IMPLIED_BY: Partial<Record<string, string[]>> = {
  [Entitlement.CAN_VIEW_AVAILABLE_MACHINES]: [
    Entitlement.CAN_VIEW_MACHINES,
    Entitlement.CAN_EDIT_MACHINES,
  ],
  [Entitlement.CAN_DEPLOY_MACHINES]: [Entitlement.CAN_EDIT_MACHINES],
};

const getSatisfyingEntitlements = (entitlement: string): string[] => [
  entitlement,
  // If the user has the edit entitlement, they also have the view entitlement
  entitlement.replace(/^can_view_/, "can_edit_"),
  ...(IMPLIED_BY[entitlement] ?? []),
];

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
    const satisfying = getSatisfyingEntitlements(entitlement);
    return current_entitlements.some((current) =>
      satisfying.includes(current.entitlement)
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

  const satisfying = getSatisfyingEntitlements(entitlement);
  return current_entitlements.some(
    (current) =>
      satisfying.includes(current.entitlement) &&
      (current.resource_type === "maas" ||
        (current.resource_type === "pool" && current.resource_id === poolId))
  );
};
