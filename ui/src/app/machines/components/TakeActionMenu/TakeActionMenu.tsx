import { useEffect } from "react";

import { ContextualMenu, Tooltip } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import type { SetSelectedAction } from "app/machines/views/MachineDetails/types";
import { actions as generalActions } from "app/store/general";
import { machineActions as machineActionsSelectors } from "app/store/general/selectors";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

const getTakeActionLinks = (
  actionOptions: MachineAction[],
  machines: Machine[],
  setSelectedAction: SetSelectedAction,
  appearance: Props["appearance"]
) => {
  const initGroups = [
    { type: "lifecycle", items: [] },
    { type: "power", items: [] },
    { type: "testing", items: [] },
    { type: "lock", items: [] },
    { type: "misc", items: [] },
  ];

  const groupedLinks = actionOptions.reduce((groups, option) => {
    // We don't include the delete action in the VM table because it is handled
    // separately
    if (appearance === "vmTable" && option.name === NodeActions.DELETE) {
      return groups;
    }
    const count = machines.reduce((sum, machine) => {
      if (machine.actions.includes(option.name)) {
        sum += 1;
      }
      return sum;
    }, 0);

    if (count > 0 || option.type === "lifecycle") {
      const group = groups.find((group) => group.type === option.type);
      group.items.push({
        children: (
          <div className="u-flex--between">
            <span data-test={`action-title-${option.name}`}>
              {option.title}
            </span>
            {machines.length > 1 && (
              <span
                data-test={`action-count-${option.name}`}
                style={{ marginLeft: ".5rem" }}
              >
                {count || ""}
              </span>
            )}
          </div>
        ),
        disabled: count === 0,
        onClick: () => setSelectedAction(option),
      });
    }
    return groups;
  }, initGroups);

  return groupedLinks.map((group) => group.items);
};

type Props = {
  appearance?: "default" | "vmTable";
  setSelectedAction: SetSelectedAction;
};

export const TakeActionMenu = ({
  appearance = "default",
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const actionOptions = useSelector(machineActionsSelectors.get);
  const selectedMachines = useSelector(machineSelectors.selected);
  const machinesToAction = activeMachine ? [activeMachine] : selectedMachines;

  useEffect(() => {
    dispatch(generalActions.fetchMachineActions());
  }, [dispatch]);

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
      message={!selectedMachines.length ? variations.tooltipMessage : null}
      position={variations.tooltipPosition}
    >
      <ContextualMenu
        data-test="take-action-dropdown"
        hasToggleIcon
        links={getTakeActionLinks(
          actionOptions,
          selectedMachines,
          setSelectedAction,
          appearance
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
