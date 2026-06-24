import { useGetUserEntitlements } from "@/app/api/query/auth";
import type { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { hasPermissions } from "@/app/utils/permissions";

export const useHasEntitlements = (requiredEntitlements: Entitlement[]) => {
  const { data: userEntitlements } = useGetUserEntitlements();
  return hasPermissions(userEntitlements || [], requiredEntitlements);
};
