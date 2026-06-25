import { useGetUserEntitlements } from "@/app/api/query/auth";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { hasPermissions } from "@/app/utils/permissions";

export const useHasEntitlements = (requiredEntitlements: Entitlement[]) => {
  const { data: userEntitlements } = useGetUserEntitlements();
  return hasPermissions(userEntitlements || [], requiredEntitlements);
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
