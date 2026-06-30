import { useSelector } from "react-redux";

import { settingsNavItems } from "./constants";
import settingsURLs from "./urls";

import type { NavItem } from "@/app/base/components/SecondaryNavigation/SecondaryNavigation";
import configSelectors from "@/app/store/config/selectors";

export const useSettingsNavItems = (): NavItem[] => {
  const switchProvisioningEnabled = useSelector(
    configSelectors.experimentalSwitchProvisioning
  );

  if (!switchProvisioningEnabled) return settingsNavItems;

  return settingsNavItems.map((section) => {
    if (section.label !== "Scripts") return section;
    return {
      ...section,
      items: [
        ...(section.items ?? []),
        { path: settingsURLs.scripts.switch.index, label: "Switch scripts" },
      ],
    };
  });
};
