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
  const globalEntities = useHasEntitlements([
    Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
  ]);
  const identities = useHasEntitlements([Entitlement.CAN_VIEW_IDENTITIES]);
  const licenseKeys = useHasEntitlements([Entitlement.CAN_VIEW_LICENSE_KEYS]);

  const disabledPaths = useMemo(() => {
    const paths: string[] = [];
    if (!configurations.isPending && !configurations.allowed) {
      paths.push(
        settingsURLs.images.windows,
        settingsURLs.images.vmware,
        settingsURLs.security.securityProtocols,
        settingsURLs.security.secretStorage,
        settingsURLs.security.ipmiSettings
      );
    }
    if (!bootEntities.isPending && !bootEntities.allowed) {
      paths.push(settingsURLs.images.sources);
    }
    if (!globalEntities.isPending && !globalEntities.allowed) {
      paths.push(
        settingsURLs.security.trustedSshHostKeys,
        settingsURLs.scripts.commissioning.index,
        settingsURLs.scripts.deploying.index,
        settingsURLs.scripts.testing.index,
        settingsURLs.dhcp.index,
        settingsURLs.repositories.index
      );
    }
    if (!identities.isPending && !identities.allowed) {
      paths.push(
        settingsURLs.userManagement.users,
        settingsURLs.userManagement.groups,
        settingsURLs.userManagement.singleSignOn
      );
    }
    if (!licenseKeys.isPending && !licenseKeys.allowed) {
      paths.push(settingsURLs.licenseKeys.index);
    }
    return paths;
  }, [
    configurations.allowed,
    configurations.isPending,
    bootEntities.allowed,
    bootEntities.isPending,
    globalEntities.allowed,
    globalEntities.isPending,
    identities.allowed,
    identities.isPending,
    licenseKeys.allowed,
    licenseKeys.isPending,
  ]);

  return useMemo(() => {
    if (disabledPaths.length === 0) {
      return settingsNavItems;
    }

    const applyDisabled = (item: NavItem): NavItem => {
      const updated =
        item.path && disabledPaths.includes(item.path)
          ? { ...item, disabled: true }
          : item;
      return updated.items
        ? { ...updated, items: updated.items.map(applyDisabled) }
        : updated;
    };

    return settingsNavItems.map(applyDisabled);
  }, [disabledPaths]);
};
