import { MachineHeaderViews } from "./constants";
import type { MachineSidePanelContent } from "./types";

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
    const [, name] = sidePanelContent.view as MachineSidePanelContent["view"];
    switch (name) {
      case MachineHeaderViews.ADD_CHASSIS[1]:
        return "Add chassis";
      case MachineHeaderViews.ADD_MACHINE[1]:
        return "Add machine";
      default:
        return getNodeActionTitle(name);
    }
  }
  return defaultTitle;
};
