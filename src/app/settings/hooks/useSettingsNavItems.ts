import { useMemo } from "react";

import type { NavItem } from "@/app/base/components/SecondaryNavigation/SecondaryNavigation";
import { useHasEntitlements } from "@/app/base/hooks";
import { settingsNavItems } from "@/app/settings/constants";
import settingsURLs from "@/app/settings/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

export const useSettingsNavItems = (): NavItem[] => {
  const configurations = useHasEntitlements([
    Entitlement.CAN_VIEW_CONFIGURATIONS,
  ]);
  const bootEntities = useHasEntitlements([Entitlement.CAN_VIEW_BOOT_ENTITIES]);

  const disabledPaths = useMemo(() => {
    const paths: string[] = [];
    if (!configurations.isPending && !configurations.allowed) {
      paths.push(settingsURLs.images.windows, settingsURLs.images.vmware);
    }
    if (!bootEntities.isPending && !bootEntities.allowed) {
      paths.push(settingsURLs.images.sources);
    }
    return paths;
  }, [
    configurations.allowed,
    configurations.isPending,
    bootEntities.allowed,
    bootEntities.isPending,
  ]);

  return useMemo(() => {
    if (disabledPaths.length === 0) {
      return settingsNavItems;
    }

    return settingsNavItems.map((group) =>
      group.items
        ? {
            ...group,
            items: group.items.map((item) =>
              item.path && disabledPaths.includes(item.path)
                ? { ...item, disabled: true }
                : item
            ),
          }
        : group
    );
  }, [disabledPaths]);
};
