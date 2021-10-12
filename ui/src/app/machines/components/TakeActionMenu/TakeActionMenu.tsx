import { ContextualMenu, Tooltip } from "@canonical/react-components";
import type { ButtonProps } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import type { DataTestElement } from "app/base/types";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetHeaderContent } from "app/machines/types";
import { canOpenActionForm, getActionTitle } from "app/machines/utils";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

type ActionGroup = {
  name: string;
  actions: MachineAction["name"][];
};

type ActionLink = DataTestElement<ButtonProps>;

type Props = {
  appearance?: "default" | "vmTable";
  excludeActions?: NodeActions[];
  setHeaderContent: MachineSetHeaderContent;
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
      NodeActions.DELETE,
    ],
  },
];

const getTakeActionLinks = (
  machines: Machine[],
  setHeaderContent: Props["setHeaderContent"],
  excludeActions: NodeActions[]
) => {
  return actionGroups.reduce<ActionLink[][]>((links, group) => {
    const groupLinks = group.actions.reduce<ActionLink[]>(
      (groupLinks, action) => {
        if (excludeActions.includes(action)) {
          return groupLinks;
        }
        const count = machines.reduce(
          (sum, machine) =>
            canOpenActionForm(machine, action) ? sum + 1 : sum,
          0
        );
        // Lifecycle actions get displayed regardless of whether the selected
        // machines can perform them. All other actions are not shown.
        if (count > 0 || group.name === "lifecycle") {
          groupLinks.push({
            children: (
              <div className="u-flex--between">
                <span>{getActionTitle(action)}...</span>
                {machines.length > 1 && (
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
            onClick: () => {
              const headerView = Object.values(MachineHeaderViews).find(
                (view) => view[1] === action
              );
              if (headerView) {
                setHeaderContent({ view: headerView });
              }
            },
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

export const TakeActionMenu = ({
  appearance = "default",
  excludeActions = [],
  setHeaderContent,
}: Props): JSX.Element => {
  const activeMachine = useSelector(machineSelectors.active);
  const selectedMachines = useSelector(machineSelectors.selected);
  const machinesToAction = activeMachine ? [activeMachine] : selectedMachines;

  const variations =
    appearance === "default"
      ? {
          position: "right" as const,
          toggleAppearance: "positive",
          tooltipMessage: "Select machines below to perform an action.",
          tooltipPosition: "left" as const,
        }
      : {
          position: "left" as const,
          toggleAppearance: "neutral",
          tooltipMessage: "Select VMs below to perform an action.",
          tooltipPosition: "top-left" as const,
        };

  return (
    <Tooltip
      message={!machinesToAction.length ? variations.tooltipMessage : null}
      position={variations.tooltipPosition}
    >
      <ContextualMenu
        data-test="take-action-dropdown"
        hasToggleIcon
        links={getTakeActionLinks(
          machinesToAction,
          setHeaderContent,
          excludeActions
        )}
        position={variations.position}
        toggleAppearance={variations.toggleAppearance}
        toggleDisabled={!machinesToAction.length}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

TakeActionMenu.propTypes = {
  setHeaderContent: PropTypes.func.isRequired,
};

export default TakeActionMenu;
