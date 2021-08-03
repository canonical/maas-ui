import { ContextualMenu, Tooltip } from "@canonical/react-components";
import type { ButtonProps } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import type { MachineSetSelectedAction } from "app/machines/views/types";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

type ActionGroup = {
  name: string;
  actions: {
    label: string;
    name: MachineAction["name"];
  }[];
};

type ActionLink = ButtonProps<{ "data-test"?: string }>;

type Props = {
  appearance?: "default" | "vmTable";
  excludeActions?: NodeActions[];
  setSelectedAction: MachineSetSelectedAction;
};

const actionGroups: ActionGroup[] = [
  {
    name: "lifecycle",
    actions: [
      { label: "Commission...", name: NodeActions.COMMISSION },
      { label: "Acquire...", name: NodeActions.ACQUIRE },
      { label: "Deploy...", name: NodeActions.DEPLOY },
      { label: "Release...", name: NodeActions.RELEASE },
      { label: "Abort...", name: NodeActions.ABORT },
    ],
  },
  {
    name: "power",
    actions: [
      { label: "Power on...", name: NodeActions.ON },
      { label: "Power off...", name: NodeActions.OFF },
    ],
  },
  {
    name: "testing",
    actions: [
      { label: "Test...", name: NodeActions.TEST },
      { label: "Enter rescue mode...", name: NodeActions.RESCUE_MODE },
      { label: "Exit rescue mode...", name: NodeActions.EXIT_RESCUE_MODE },
      { label: "Mark fixed...", name: NodeActions.MARK_FIXED },
      { label: "Mark broken...", name: NodeActions.MARK_BROKEN },
      {
        label: "Override failed testing...",
        name: NodeActions.OVERRIDE_FAILED_TESTING,
      },
    ],
  },
  {
    name: "lock",
    actions: [
      { label: "Lock...", name: NodeActions.LOCK },
      { label: "Unlock...", name: NodeActions.UNLOCK },
    ],
  },
  {
    name: "misc",
    actions: [
      { label: "Tag...", name: NodeActions.TAG },
      { label: "Set zone...", name: NodeActions.SET_ZONE },
      { label: "Set pool...", name: NodeActions.SET_POOL },
      { label: "Delete...", name: NodeActions.DELETE },
    ],
  },
];

const getTakeActionLinks = (
  machines: Machine[],
  setSelectedAction: Props["setSelectedAction"],
  excludeActions: NodeActions[]
) => {
  return actionGroups.reduce<ActionLink[][]>((links, group) => {
    const groupLinks = group.actions.reduce<ActionLink[]>(
      (groupLinks, action) => {
        if (excludeActions.includes(action.name)) {
          return groupLinks;
        }
        const count = machines.reduce(
          (sum, machine) =>
            machine.actions.includes(action.name) ? sum + 1 : sum,
          0
        );
        // Lifecycle actions get displayed regardless of whether the selected
        // machines can perform them. All other actions are not shown.
        if (count > 0 || group.name === "lifecycle") {
          groupLinks.push({
            children: (
              <div className="u-flex--between">
                <span>{action.label}</span>
                {machines.length > 1 && (
                  <span
                    className="u-nudge-right--small"
                    data-test={`action-count-${action.name}`}
                  >
                    {count || ""}
                  </span>
                )}
              </div>
            ),
            "data-test": `action-link-${action.name}`,
            disabled: count === 0,
            onClick: () => {
              setSelectedAction({ name: action.name });
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
  setSelectedAction,
}: Props): JSX.Element => {
  const activeMachine = useSelector(machineSelectors.active);
  const selectedMachines = useSelector(machineSelectors.selected);
  const machinesToAction = activeMachine ? [activeMachine] : selectedMachines;

  const variations =
    appearance === "default"
      ? {
          position: "right" as const,
          toggleAppearance: "positive",
          toggleClassName: undefined,
          toggleLabel: "Take action",
          tooltipMessage: "Select machines below to perform an action.",
          tooltipPosition: "left" as const,
        }
      : {
          position: "left" as const,
          toggleAppearance: "base",
          toggleClassName: "take-action-menu--vm-table is-small",
          toggleLabel: "",
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
          setSelectedAction,
          excludeActions
        )}
        position={variations.position}
        toggleAppearance={variations.toggleAppearance}
        toggleClassName={variations.toggleClassName}
        toggleDisabled={!machinesToAction.length}
        toggleLabel={variations.toggleLabel}
      />
    </Tooltip>
  );
};

TakeActionMenu.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default TakeActionMenu;
