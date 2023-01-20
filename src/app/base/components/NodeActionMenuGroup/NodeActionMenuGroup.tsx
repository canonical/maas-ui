import type { ReactNode } from "react";

import type { ButtonProps } from "@canonical/react-components";
import {
  Button,
  Switch,
  ContextualMenu,
  Icon,
  Tooltip,
} from "@canonical/react-components";

import type { DataTestElement } from "app/base/types";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { canOpenActionForm, getNodeActionTitle } from "app/store/utils";

type ActionGroup = {
  actions: NodeActions[];
  icon?: string;
  name: string;
  title: string;
};

type ActionLink = DataTestElement<ButtonProps>;

type Props = {
  alwaysShowLifecycle?: boolean;
  disabledTooltipPosition?: "left" | "top-left";
  excludeActions?: NodeActions[];
  filterActions?: boolean;
  getTitle?: (action: NodeActions) => ReactNode | null;
  hasSelection: boolean;
  isNodeLocked?: boolean;
  nodeDisplay?: string;
  nodes?: Node[];
  onActionClick: (action: NodeActions) => void;
  singleNode?: boolean;
  showCount?: boolean;
};

export enum Labels {
  Actions = "Actions",
  PowerCycle = "Power cycle",
  Troubleshoot = "Troubleshoot",
  Categorise = "Categorise",
  Lock = "Lock",
  Delete = "Delete",
}

const actionGroups: ActionGroup[] = [
  {
    name: "lifecycle",
    actions: [
      NodeActions.COMMISSION,
      NodeActions.ACQUIRE,
      NodeActions.DEPLOY,
      NodeActions.RELEASE,
      NodeActions.ABORT,
      NodeActions.CLONE,
    ],
    title: Labels.Actions,
  },
  {
    name: "power",
    actions: [NodeActions.ON, NodeActions.OFF],
    title: Labels.PowerCycle,
  },
  {
    name: "testing",
    actions: [
      NodeActions.TEST,
      NodeActions.RESCUE_MODE,
      NodeActions.EXIT_RESCUE_MODE,
      NodeActions.MARK_FIXED,
      NodeActions.MARK_BROKEN,
      NodeActions.OVERRIDE_FAILED_TESTING,
    ],
    title: Labels.Troubleshoot,
  },
  {
    name: "misc",
    actions: [
      NodeActions.TAG,
      NodeActions.SET_ZONE,
      NodeActions.SET_POOL,
      NodeActions.IMPORT_IMAGES,
    ],
    title: Labels.Categorise,
  },
  {
    name: "lock",
    actions: [NodeActions.LOCK, NodeActions.UNLOCK],
    title: "Lock",
  },
  {
    name: "delete",
    actions: [NodeActions.DELETE],
    icon: "delete",
    title: "Delete",
  },
];

const generateActionMenus = (
  alwaysShowLifecycle: boolean,
  excludeActions: NodeActions[],
  onActionClick: (action: NodeActions) => void,
  filterActions?: boolean,
  getTitle?: Props["getTitle"],
  nodes?: Node[],
  showCount?: boolean,
  singleNode?: boolean
) => {
  return actionGroups.reduce<JSX.Element[]>((menus, group) => {
    const groupLinks = group.actions.reduce<ActionLink[]>(
      (groupLinks, action) => {
        if (excludeActions.includes(action)) {
          return groupLinks;
        }

        if (action === NodeActions.DELETE) {
          // Delete is displayed as a discrete button
          return groupLinks;
        }

        if (
          singleNode &&
          (action === NodeActions.LOCK || action === NodeActions.UNLOCK)
        ) {
          // If the lock/unlock actions are to be displayed as a switch, don't show a menu
          return groupLinks;
        }
        // When nodes are not provided then counts should not be visible.
        const count =
          nodes?.reduce(
            (sum, node) => (canOpenActionForm(node, action) ? sum + 1 : sum),
            0
          ) ?? 0;
        // If alwaysShowLifecycle is true, we display lifecycle actions
        // regardless of whether any of the provided nodes can perform them.
        // Otherwise, the action is not rendered.
        if (
          (filterActions &&
            (count > 0 ||
              (group.name === "lifecycle" && alwaysShowLifecycle))) ||
          // When there are no counts the actions should always be visible.
          !filterActions
        ) {
          groupLinks.push({
            children: (
              <div className="u-flex--between">
                <span>
                  {getTitle?.(action) ?? getNodeActionTitle(action)}
                  ...
                </span>
                {showCount && (
                  <span
                    className="u-nudge-right--small"
                    data-testid={`action-count-${action}`}
                  >
                    {count || ""}
                  </span>
                )}
              </div>
            ),
            "data-testid": `action-link-${action}`,
            // When nodes are not provided actions should always be enabled.
            disabled: nodes ? count === 0 : false,
            onClick: () => onActionClick(action),
          });
        }
        return groupLinks;
      },
      []
    );

    if (groupLinks.length > 0) {
      menus.push(
        <ContextualMenu
          dropdownProps={{ "aria-label": `${group.title} submenu` }}
          hasToggleIcon
          links={groupLinks}
          position="center"
          toggleLabel={
            !group.icon ? (
              group.title
            ) : (
              <>
                <Icon name={group.icon} />
                {group.title}
              </>
            )
          }
        />
      );
    }
    return menus;
  }, []);
};

export const NodeActionMenuGroup = ({
  alwaysShowLifecycle = false,
  disabledTooltipPosition = "left",
  excludeActions = [],
  filterActions,
  getTitle,
  hasSelection,
  isNodeLocked,
  nodeDisplay = "node",
  nodes,
  onActionClick,
  showCount,
  singleNode = false,
}: Props): JSX.Element => {
  const menus = generateActionMenus(
    alwaysShowLifecycle,
    excludeActions,
    onActionClick,
    filterActions,
    getTitle,
    nodes,
    showCount,
    singleNode
  );

  return (
    <Tooltip
      className="p-node-action-menu-group"
      message={
        !hasSelection
          ? `Select ${nodeDisplay}s below to perform an action.`
          : null
      }
      position={disabledTooltipPosition}
    >
      {menus.map((menu, i) => (
        <span className="p-action-button--wrapper" key={i}>
          {menu}
        </span>
        // <>{menu}</>
      ))}
      {singleNode &&
        nodes &&
        // Only check if the node can lock/unlock if filterActions is true, else render regardless
        (filterActions
          ? canOpenActionForm(nodes[0], NodeActions.LOCK) ||
            canOpenActionForm(nodes[0], NodeActions.UNLOCK)
          : true) && (
          <span className="p-action-button--wrapper">
            <Switch
              checked={isNodeLocked}
              label={Labels.Lock}
              onChange={() => {
                onActionClick(
                  isNodeLocked ? NodeActions.UNLOCK : NodeActions.LOCK
                );
              }}
            />
          </span>
        )}
      <span className="p-action-button--wrapper">
        <Button onClick={() => onActionClick(NodeActions.DELETE)}>
          <Icon name="delete" />
          {Labels.Delete}
        </Button>
      </span>
    </Tooltip>
  );
};

export default NodeActionMenuGroup;
