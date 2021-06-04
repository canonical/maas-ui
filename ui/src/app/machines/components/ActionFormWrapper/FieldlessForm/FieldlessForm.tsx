import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import ActionForm from "app/base/components/ActionForm";
import type { ClearSelectedAction } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import machineURLs from "app/machines/urls";
import type { MachineSelectedAction } from "app/machines/views/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { NodeActions } from "app/store/types/node";
import { kebabToCamelCase } from "app/utils";

// List of machine actions that do not require any extra parameters sent through
// the websocket apart from machine system id. All other actions will have
// their own form components.
const fieldlessActions = [
  NodeActions.ABORT,
  NodeActions.ACQUIRE,
  NodeActions.DELETE,
  NodeActions.EXIT_RESCUE_MODE,
  NodeActions.LOCK,
  NodeActions.MARK_BROKEN,
  NodeActions.MARK_FIXED,
  NodeActions.OFF,
  NodeActions.ON,
  NodeActions.RESCUE_MODE,
  NodeActions.UNLOCK,
];

type Props = {
  actionDisabled?: boolean;
  selectedAction: MachineSelectedAction;
  clearSelectedAction: ClearSelectedAction;
};

export const FieldlessForm = ({
  actionDisabled,
  selectedAction,
  clearSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    selectedAction.name
  );
  const isDeletingMachine =
    activeMachine &&
    selectedAction.name === NodeActions.DELETE &&
    processingCount === 1;
  const previousIsDeletingMachine = usePrevious(isDeletingMachine, false);
  // Check if the machine cycled from deleting to not deleting and didn't
  // return an error.
  if (previousIsDeletingMachine && !isDeletingMachine && !errors) {
    // The machine was just deleted so redirect to the machine list.
    return <Redirect to={machineURLs.machines.index} />;
  }

  return (
    <ActionForm<Record<string, never>>
      actionDisabled={actionDisabled}
      actionName={selectedAction.name}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={clearSelectedAction}
      errors={errors}
      initialValues={{}}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: selectedAction.name,
      }}
      onSubmit={() => {
        if (fieldlessActions.includes(selectedAction.name)) {
          const actionMethod = kebabToCamelCase(selectedAction.name);
          // Find the method for the function.
          const [, actionFunction] =
            Object.entries(machineActions).find(
              ([key]) => key === actionMethod
            ) || [];
          if (actionFunction) {
            machinesToAction.forEach((machine) => {
              dispatch(actionFunction(machine.system_id));
            });
          }
        }
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      submitAppearance={
        selectedAction.name === NodeActions.DELETE ? "negative" : "positive"
      }
    />
  );
};

export default FieldlessForm;
