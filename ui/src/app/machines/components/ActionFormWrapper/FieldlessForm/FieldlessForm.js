import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { kebabToCamelCase } from "app/utils";
import { actions as machineActions } from "app/store/machine";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import ActionForm from "app/base/components/ActionForm";

import { NodeActions } from "app/store/types/node";

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
  NodeActions.RELEASE,
  NodeActions.RESCUE_MODE,
  NodeActions.UNLOCK,
];

export const FieldlessForm = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    selectedAction.name
  );

  return (
    <ActionForm
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

FieldlessForm.propTypes = {
  selectedAction: PropTypes.object.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default FieldlessForm;
