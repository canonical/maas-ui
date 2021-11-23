import type {
  ButtonAppearance,
  ButtonProps,
  ValueOf,
} from "@canonical/react-components";
import { ContextualMenu, Tooltip } from "@canonical/react-components";

import type { DataTestElement } from "app/base/types";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { canOpenActionForm, getNodeActionTitle } from "app/store/utils/node";

type ActionGroup = {
  actions: NodeActions[];
  name: string;
};

type ActionLink = DataTestElement<ButtonProps>;

type Props = {
  alwaysShowLifecycle?: boolean;
  disabledTooltipPosition?: "left" | "top-left";
  excludeActions?: NodeActions[];
  menuPosition?: "left" | "right";
  nodeDisplay?: string;
  nodes: Node[];
  onActionClick: (action: NodeActions) => void;
  toggleAppearance?: ValueOf<typeof ButtonAppearance>;
  toggleClassName?: string | null;
};

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
  },
  {
    name: "power",
    actions: [NodeActions.ON, NodeActions.OFF],
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
  },
  {
    name: "lock",
    actions: [NodeActions.LOCK, NodeActions.UNLOCK],
  },
  {
    name: "misc",
    actions: [
      NodeActions.TAG,
      NodeActions.SET_ZONE,
      NodeActions.SET_POOL,
      NodeActions.IMPORT_IMAGES,
      NodeActions.DELETE,
    ],
  },
];

const getTakeActionLinks = (
  nodes: Node[],
  onActionClick: (action: NodeActions) => void,
  excludeActions: NodeActions[],
  alwaysShowLifecycle: boolean
) => {
  return actionGroups.reduce<ActionLink[][]>((links, group) => {
    const groupLinks = group.actions.reduce<ActionLink[]>(
      (groupLinks, action) => {
        if (excludeActions.includes(action)) {
          return groupLinks;
        }
        const count = nodes.reduce(
          (sum, node) => (canOpenActionForm(node, action) ? sum + 1 : sum),
          0
        );
        // If alwaysShowLifecycle is true, we display lifecycle actions
        // regardless of whether any of the provided nodes can perform them.
        // Otherwise, the action is not rendered.
        if (count > 0 || (group.name === "lifecycle" && alwaysShowLifecycle)) {
          groupLinks.push({
            children: (
              <div className="u-flex--between">
                <span>{getNodeActionTitle(action)}...</span>
                {nodes.length > 1 && (
                  <span
                    className="u-nudge-right--small"
                    data-test={`action-count-${action}`}
                  >
                    {count || ""}
                  </span>
                )}
              </div>
            ),
            "data-test": `action-link-${action}`,
            disabled: count === 0,
            onClick: () => onActionClick(action),
          });
        }
        return groupLinks;
      },
      []
    );

    if (groupLinks.length > 0) {
      links.push(groupLinks);
    }
    return links;
  }, []);
};

export const NodeActionMenu = ({
  alwaysShowLifecycle = false,
  disabledTooltipPosition = "left",
  excludeActions = [],
  menuPosition = "right",
  nodeDisplay = "node",
  nodes,
  onActionClick,
  toggleAppearance = "positive",
  toggleClassName,
}: Props): JSX.Element => {
  return (
    <Tooltip
      message={
        !nodes.length
          ? `Select ${nodeDisplay}s below to perform an action.`
          : null
      }
      position={disabledTooltipPosition}
    >
      <ContextualMenu
        data-test="take-action-dropdown"
        hasToggleIcon
        links={getTakeActionLinks(
          nodes,
          onActionClick,
          excludeActions,
          alwaysShowLifecycle
        )}
        position={menuPosition}
        toggleAppearance={toggleAppearance}
        toggleClassName={toggleClassName}
        toggleDisabled={!nodes.length}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

export default NodeActionMenu;
