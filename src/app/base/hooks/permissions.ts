import { useSelector } from "react-redux";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { hasEntitlementForPool, hasPermissions } from "@/app/utils/permissions";

export const useHasEntitlements = (requiredEntitlements: Entitlement[]) => {
  const { data: userEntitlements } = useGetUserEntitlements();
  return hasPermissions(userEntitlements || [], requiredEntitlements);
};

export const useCanEditMachine = (
  systemId?: Machine["system_id"] | null
): boolean => {
  const { data: userEntitlements } = useGetUserEntitlements();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return hasPermissions(userEntitlements || [], [
      Entitlement.CAN_EDIT_MACHINES,
    ]);
  }
  return hasEntitlementForPool(
    userEntitlements,
    Entitlement.CAN_EDIT_MACHINES,
    machine.pool.id
  );
};

// We don't have a way to check if the user is a superuser, so we check if they
// have all the EDIT entitlements.
const SUPERUSER_ENTITLEMENTS = [
  Entitlement.CAN_EDIT_CONFIGURATIONS,
  Entitlement.CAN_EDIT_GLOBAL_ENTITIES,
  Entitlement.CAN_EDIT_IDENTITIES,
  Entitlement.CAN_EDIT_MACHINES,
  Entitlement.CAN_EDIT_BOOT_ENTITIES,
  Entitlement.CAN_EDIT_LICENSE_KEYS,
  Entitlement.CAN_EDIT_CONTROLLERS,
  Entitlement.CAN_EDIT_NOTIFICATIONS,
];

export const useIsSuperUser = () => useHasEntitlements(SUPERUSER_ENTITLEMENTS);
