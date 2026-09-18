import type { NavItem } from "@/app/base/components/SecondaryNavigation/SecondaryNavigation";
import { settingsNavItems } from "@/app/settings/constants";

export const useSettingsNavItems = (): NavItem[] => {
  return settingsNavItems;
};
