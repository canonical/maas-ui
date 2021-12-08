import { DeviceHeaderViews } from "./constants";
import type { DeviceHeaderContent } from "./types";

import { getNodeActionTitle } from "app/store/utils";

/**
 * Get title depending on header content.
 * @param defaultTitle - Title to show if no header content open.
 * @param headerContentName - The name of the header content to check.
 * @returns Header title string.
 */
export const getHeaderTitle = (
  defaultTitle: string,
  headerContent: DeviceHeaderContent | null
): string => {
  if (headerContent) {
    const [, name] = headerContent.view;
    switch (name) {
      case DeviceHeaderViews.ADD_DEVICE[1]:
        return "Add device";
      default:
        return getNodeActionTitle(name);
    }
  }
  return defaultTitle;
};
