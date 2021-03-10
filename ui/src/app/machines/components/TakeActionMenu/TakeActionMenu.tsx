import { useEffect } from "react";

import { ContextualMenu, Tooltip } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import type { RouteParams } from "app/base/types";
import type { SetSelectedAction } from "app/machines/views/MachineDetails/types";
import { actions as generalActions } from "app/store/general";
import { machineActions as machineActionsSelectors } from "app/store/general/selectors";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const getTakeActionLinks = (
  actionOptions: MachineAction[],
  machines: Machine[],
  setSelectedAction: SetSelectedAction
) => {
  const initGroups = [
    { type: "lifecycle", items: [] },
    { type: "power", items: [] },
    { type: "testing", items: [] },
    { type: "lock", items: [] },
    { type: "misc", items: [] },
  ];

  const groupedLinks = actionOptions.reduce((groups, option) => {
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
  setSelectedAction: SetSelectedAction;
};

export const TakeActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const actionOptions = useSelector(machineActionsSelectors.get);
  const machineFromID = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const selectedMachinesInState = useSelector(machineSelectors.selected);
  const selectedMachines = machineFromID
    ? [machineFromID]
    : selectedMachinesInState;

  useEffect(() => {
    dispatch(generalActions.fetchMachineActions());
  }, [dispatch]);

  return (
    <Tooltip
      message={
        !selectedMachines.length &&
        "Select machines below to perform an action."
      }
      position="left"
    >
      <ContextualMenu
        data-test="take-action-dropdown"
        hasToggleIcon
        links={getTakeActionLinks(
          actionOptions,
          selectedMachines,
          setSelectedAction
        )}
        position="right"
        toggleAppearance="positive"
        toggleDisabled={!selectedMachines.length}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

TakeActionMenu.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default TakeActionMenu;
