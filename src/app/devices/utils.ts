import { DeviceHeaderViews } from "./constants";
import type { DeviceSidePanelContent } from "./types";

import { getNodeActionTitle } from "app/store/utils";

/**
 * Get title depending on header content.
 * @param defaultTitle - Title to show if no header content open.
 * @param sidePanelContent - The name of the header content to check.
 * @returns Header title string.
 */
export const getHeaderTitle = (
  defaultTitle: string,
  sidePanelContent: DeviceSidePanelContent | null
): string => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case DeviceHeaderViews.ADD_DEVICE[1]:
        return "Add device";
      default:
        return getNodeActionTitle(name);
    }
  }
  return defaultTitle;
};

export const getHeaderSize = (
  sidePanelContent: DeviceSidePanelContent | null
): "wide" | undefined => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case DeviceHeaderViews.ADD_DEVICE[1]:
        return "wide";
      default:
        return undefined;
    }
  }
  return undefined;
};
