import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { kebabToCamelCase } from "app/utils";
import { machine as machineActions } from "app/base/actions";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import ActionForm from "app/base/components/ActionForm";

// List of machine actions that do not require any extra parameters sent through
// the websocket apart from machine system id. All other actions will have
// their own form components.
const fieldlessActions = [
  "abort",
  "acquire",
  "delete",
  "exit-rescue-mode",
  "lock",
  "mark-broken",
  "mark-fixed",
  "off",
  "on",
  "release",
  "rescue-mode",
  "unlock",
];

export const FieldlessForm = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const { machinesToAction, processingCount } = useMachineActionForm(
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
        selectedAction.name === "delete" ? "negative" : "positive"
      }
    />
  );
};

FieldlessForm.propTypes = {
  selectedAction: PropTypes.object.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default FieldlessForm;
