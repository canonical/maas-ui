import {
  SidePanelViews,
  type SidePanelContent,
} from "app/base/side-panel-context";
import type { Controller } from "app/store/controller/types";
import { isControllerDetails } from "app/store/controller/utils";
import type { Device } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import type { Machine } from "app/store/machine/types";
// Import from the common utils to prevent an import loop in machine/utils/index.ts.
import { isMachineDetails } from "app/store/machine/utils/common";
import type { Node, NodeDetails } from "app/store/types/node";
import {
  NodeActions,
  NodeLinkType,
  NodeStatus,
  NodeType,
  NodeTypeDisplay,
} from "app/store/types/node";

/**
 * Get node type display from node type.
 * @param nodeType - The type of the node.
 * @returns Node type display.
 */
export const getNodeTypeDisplay = (nodeType: NodeType): string => {
  switch (nodeType) {
    case NodeType.DEFAULT:
    case NodeType.MACHINE:
      return NodeTypeDisplay.MACHINE;
    case NodeType.DEVICE:
      return NodeTypeDisplay.DEVICE;
    case NodeType.RACK_CONTROLLER:
      return NodeTypeDisplay.RACK_CONTROLLER;
    case NodeType.REGION_CONTROLLER:
      return NodeTypeDisplay.REGION_CONTROLLER;
    case NodeType.REGION_AND_RACK_CONTROLLER:
      return NodeTypeDisplay.REGION_AND_RACK_CONTROLLER;
    default:
      return "Unknown";
  }
};

/**
 * Get title from node action name.
 * @param actionName - The name of the node action to check.
 * @returns Formatted node action title.
 */
export const getNodeActionTitle = (actionName: NodeActions): string => {
  switch (actionName) {
    case NodeActions.ABORT:
      return "Abort";
    case NodeActions.ACQUIRE:
      return "Allocate";
    case NodeActions.CHECK_POWER:
      return "Check power";
    case NodeActions.CLONE:
      return "Clone from";
    case NodeActions.COMMISSION:
      return "Commission";
    case NodeActions.DELETE:
      return "Delete";
    case NodeActions.DEPLOY:
      return "Deploy";
    case NodeActions.EXIT_RESCUE_MODE:
      return "Exit rescue mode";
    case NodeActions.IMPORT_IMAGES:
      return "Import images";
    case NodeActions.LOCK:
      return "Lock";
    case NodeActions.MARK_BROKEN:
      return "Mark broken";
    case NodeActions.MARK_FIXED:
      return "Mark fixed";
    case NodeActions.OFF:
      return "Power off";
    case NodeActions.ON:
      return "Power on";
    case NodeActions.SOFT_OFF:
      return "Soft power off";
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return "Override failed testing";
    case NodeActions.RELEASE:
      return "Release";
    case NodeActions.RESCUE_MODE:
      return "Enter rescue mode";
    case NodeActions.SET_POOL:
      return "Set pool";
    case NodeActions.SET_ZONE:
      return "Set zone";
    case NodeActions.TAG:
      return "Tag";
    case NodeActions.TEST:
      return "Test";
    case NodeActions.UNLOCK:
      return "Unlock";
    default:
      return "Action";
  }
};

export const getNodeActionLabel = (
  modelString: string,
  actionName: string,
  isProcessing: boolean
): string => {
  switch (actionName) {
    case NodeActions.ABORT:
      return `${
        isProcessing ? "Aborting" : "Abort"
      } actions for ${modelString}`;
    case NodeActions.ACQUIRE:
      return `${isProcessing ? "Allocating" : "Allocate"} ${modelString}`;
    case NodeActions.CHECK_POWER:
      return `${
        isProcessing ? "Checking power" : "Check power"
      } for ${modelString}`;
    case NodeActions.CLONE:
      return isProcessing ? "Cloning in progress" : `Clone to ${modelString}`;
    case NodeActions.COMMISSION:
      return `${
        isProcessing ? "Starting" : "Start"
      } commissioning for ${modelString}`;
    case "compose":
      return `${isProcessing ? "Composing" : "Compose"} ${modelString}`;
    case NodeActions.DELETE:
      return `${isProcessing ? "Deleting" : "Delete"} ${modelString}`;
    case NodeActions.DEPLOY:
      return `${isProcessing ? "Deploying" : "Deploy"} ${modelString}`;
    case NodeActions.EXIT_RESCUE_MODE:
      return `${
        isProcessing ? "Exiting" : "Exit"
      } rescue mode for ${modelString}`;
    case NodeActions.IMPORT_IMAGES:
      return `${
        isProcessing ? "Importing images" : "Import images"
      } for ${modelString}`;
    case NodeActions.LOCK:
      return `${isProcessing ? "Locking" : "Lock"} ${modelString}`;
    case NodeActions.ON:
      return `${isProcessing ? "Powering" : "Power"} on ${modelString}`;
    case NodeActions.OFF:
      return `${isProcessing ? "Powering" : "Power"} off ${modelString}`;
    case NodeActions.MARK_BROKEN:
      return `${isProcessing ? "Marking" : "Mark"} ${modelString} broken`;
    case NodeActions.MARK_FIXED:
      return `${isProcessing ? "Marking" : "Mark"} ${modelString} fixed`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `${
        isProcessing ? "Overriding" : "Override"
      } failed tests for ${modelString}`;
    case NodeActions.RELEASE:
      return `${isProcessing ? "Releasing" : "Release"} ${modelString}`;
    case "refresh":
      return `${isProcessing ? "Refreshing" : "Refresh"} ${modelString}`;
    case "remove":
      return `${isProcessing ? "Removing" : "Remove"} ${modelString}`;
    case NodeActions.RESCUE_MODE:
      return `${
        isProcessing ? "Entering" : "Enter"
      } rescue mode for ${modelString}`;
    case NodeActions.SET_POOL:
      return `${isProcessing ? "Setting" : "Set"} pool for ${modelString}`;
    case NodeActions.SET_ZONE:
      return `${isProcessing ? "Setting" : "Set"} zone for ${modelString}`;
    case NodeActions.SOFT_OFF:
      return `${isProcessing ? "Powering" : "Soft power"} off ${modelString}`;
    case NodeActions.TAG:
    case NodeActions.UNTAG:
      return `${isProcessing ? "Updating" : "Update"} tags for ${modelString}`;
    case NodeActions.TEST:
      return `${isProcessing ? "Starting" : "Start"} tests for ${modelString}`;
    case NodeActions.UNLOCK:
      return `${isProcessing ? "Unlocking" : "Unlock"} ${modelString}`;
    default:
      return `${isProcessing ? "Processing" : "Process"} ${modelString}`;
  }
};

/**
 * Get title depending on side panel content.
 * @param defaultTitle - Title to show if no header content open.
 * @param sidePanelContent - The name of the header content to check.
 * @returns Header title string.
 */
export const getSidePanelTitle = (
  defaultTitle: string,
  sidePanelContent: SidePanelContent | null
): string => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case SidePanelViews.ADD_CONTROLLER[1]:
        return "Add controller";
      case SidePanelViews.ADD_CHASSIS[1]:
        return "Add chassis";
      case SidePanelViews.ADD_MACHINE[1]:
        return "Add machine";
      case SidePanelViews.ADD_DEVICE[1]:
        return "Add device";
      case SidePanelViews.AddTag[1]:
        return "Create new tag";
      case SidePanelViews.DeleteTag[1]:
        return "Delete tag";
      case SidePanelViews.CREATE_ZONE[1]:
        return "Add AZ";
      case SidePanelViews.DELETE_SPACE[1]:
        return "Delete space";
      case SidePanelViews.DELETE_FABRIC[1]:
        return "Delete fabric";
      default:
        return name ? getNodeActionTitle(name as NodeActions) : defaultTitle;
    }
  }
  return defaultTitle;
};

// TODO: Replace NodeLinkType with NodeType when it is made available on all
// node list types.
// https://bugs.launchpad.net/maas/+bug/1951893
/**
 * Returns whether a node is a controller.
 * @param node - The node to check
 * @returns Whether the node is a controller.
 */
export const nodeIsController = (node?: Node | null): node is Controller =>
  node?.link_type === NodeLinkType.CONTROLLER;

/**
 * Returns whether a node is a device.
 * @param node - The node to check
 * @returns Whether the node is a device.
 */
export const nodeIsDevice = (node?: Node | null): node is Device =>
  node?.link_type === NodeLinkType.DEVICE;

/**
 * Returns whether a node is a machine.
 * @param node - The node to check
 * @returns Whether the node is a machine.
 */
export const nodeIsMachine = (node?: Node | null): node is Machine =>
  node?.link_type === NodeLinkType.MACHINE;

/**
 * Returns whether a node is the details version of the node type.
 * @param node - The node to check.
 * @returns Whether the node is a details type.
 */
export const isNodeDetails = (node?: Node | null): node is NodeDetails =>
  (nodeIsController(node) && isControllerDetails(node)) ||
  (nodeIsDevice(node) && isDeviceDetails(node)) ||
  (nodeIsMachine(node) && isMachineDetails(node));

/**
 * Determine whether a node can open an action form for a particular action.
 * @param node - The node to check.
 * @param actionName - The name of the action to check, e.g. "commission"
 * @returns Whether the node can open the action form.
 */
export const canOpenActionForm = (
  node: Node | null,
  actionName: NodeActions | null
): boolean => {
  if (!node || !actionName) {
    return false;
  }

  if (nodeIsMachine(node) && actionName === NodeActions.CLONE) {
    // Cloning in the UI works inverse to the rest of the machine actions - we
    // select the destination machines first then when the form is open we
    // select the machine to actually perform the clone action. The destination
    // machines can only be in a subset of statuses.
    return [NodeStatus.READY, NodeStatus.FAILED_TESTING].includes(node.status);
  }

  if (nodeIsMachine(node) && actionName === NodeActions.CHECK_POWER) {
    // "Check power" should always be shown for machines, but this action
    // won't show up in the node.actions list, so we need to return true here.
    return true;
  }
  return node.actions.some((nodeAction) => nodeAction === actionName);
};
