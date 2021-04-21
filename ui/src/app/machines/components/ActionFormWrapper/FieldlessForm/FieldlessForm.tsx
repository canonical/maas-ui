import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import type { Props as ActionFormProps } from "app/base/components/ActionForm";
import ActionForm from "app/base/components/ActionForm";
import { useMachineActionForm } from "app/machines/hooks";
import type {
  SelectedAction,
  SetSelectedAction,
} from "app/machines/views/MachineDetails/types";
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
  actionDisabled?: ActionFormProps["actionDisabled"];
  selectedAction: SelectedAction;
  setSelectedAction: SetSelectedAction;
};

export const FieldlessForm = ({
  actionDisabled,
  selectedAction,
  setSelectedAction,
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
    return <Redirect to="/machines" />;
  }

  return (
    <ActionForm
      actionDisabled={actionDisabled}
      actionName={selectedAction.name}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: selectedAction.name,
      }}
      onSubmit={() => {
        if (fieldlessActions.includes(selectedAction.name)) {
          const actionMethod = kebabToCamelCase(selectedAction.name);
          machinesToAction.forEach((machine) => {
            dispatch(machineActions[actionMethod](machine.system_id));
          });
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
