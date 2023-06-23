import { MachineSidePanelViews } from "./constants";

import type { SidePanelContent } from "app/base/side-panel-context";
import { getNodeActionTitle } from "app/store/utils";

/**
 * Get title depending on header content.
 * @param defaultTitle - Title to show if no header content open.
 * @param sidePanelContent - The name of the header content to check.
 * @returns Header title string.
 */
export const getHeaderTitle = (
  defaultTitle: string,
  sidePanelContent: SidePanelContent | null
): string => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case MachineSidePanelViews.ADD_CHASSIS[1]:
        return "Add chassis";
      case MachineSidePanelViews.ADD_MACHINE[1]:
        return "Add machine";
      default:
        return getNodeActionTitle(name);
    }
  }
  return defaultTitle;
};
