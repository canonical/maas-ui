import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { kebabToCamelCase } from "app/utils";
import { machine as machineActions } from "app/base/actions";
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

const useSelectedProcessing = (actionName) => {
  let selector;
  switch (actionName) {
    case "abort":
      selector = machineSelectors.abortingSelected;
      break;
    case "acquire":
      selector = machineSelectors.acquiringSelected;
      break;
    case "delete":
      selector = machineSelectors.deletingSelected;
      break;
    case "exit-rescue-mode":
      selector = machineSelectors.exitingRescueModeSelected;
      break;
    case "lock":
      selector = machineSelectors.lockingSelected;
      break;
    case "mark-broken":
      selector = machineSelectors.markingBrokenSelected;
      break;
    case "mark-fixed":
      selector = machineSelectors.markingFixedSelected;
      break;
    case "off":
      selector = machineSelectors.turningOffSelected;
      break;
    case "on":
      selector = machineSelectors.turningOnSelected;
      break;
    case "release":
      selector = machineSelectors.releasingSelected;
      break;
    case "rescue-mode":
      selector = machineSelectors.enteringRescueModeSelected;
      break;
    case "unlock":
      selector = machineSelectors.unlockingSelected;
      break;
    default:
      break;
  }
  return useSelector(selector);
};

export const FieldlessForm = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const selectedProcessing = useSelectedProcessing(selectedAction.name);

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
          selectedMachines.forEach((machine) => {
            if (machine.actions.includes(selectedAction.name)) {
              dispatch(machineActions[actionMethod](machine.system_id));
            }
          });
        }
      }}
      processingCount={selectedProcessing.length}
      selectedCount={selectedMachines.length}
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
