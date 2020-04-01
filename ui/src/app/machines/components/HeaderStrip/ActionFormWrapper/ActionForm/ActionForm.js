import { useDispatch, useSelector } from "react-redux";
import pluralize from "pluralize";
import React from "react";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";
import { kebabToCamelCase } from "app/utils";

const getSubmitText = (action, count) => {
  const machineString = `${count} ${pluralize("machine", count)}`;

  switch (action.name) {
    case "exit-rescue-mode":
      return `Exit rescue mode for ${machineString}`;
    case "abort":
      return `Abort actions for ${machineString}`;
    case "on":
      return `Power on ${machineString}`;
    case "off":
      return `Power off ${machineString}`;
    case "mark-broken":
      return `Mark ${machineString} broken`;
    case "mark-fixed":
      return `Mark ${machineString} fixed`;
    case "override-failed-testing":
      return `Override failed tests for ${machineString}.`;
    case "rescue-mode":
      return `Enter rescue mode for ${machineString}`;
    case "set-pool":
      return `Set pool of ${machineString}`;
    case "set-zone":
      return `Set zone of ${machineString}`;
    default:
      return `${action.name.charAt(0).toUpperCase()}${action.name.slice(
        1
      )} ${machineString}`;
  }
};

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

export const ActionForm = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const errors = useSelector(machineSelectors.errors);

  return (
    <FormikForm
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{}}
      submitAppearance={
        selectedAction.name === "delete" ? "negative" : "positive"
      }
      submitLabel={getSubmitText(selectedAction, selectedMachines.length)}
      onCancel={() => setSelectedAction(null)}
      onSaveAnalytics={{
        action: selectedAction.name,
        category: "Take action menu",
        label: selectedAction.title,
      }}
      onSubmit={() => {
        if (fieldlessActions.includes(selectedAction.name)) {
          const actionMethod = kebabToCamelCase(selectedAction.name);
          selectedMachines.forEach((machine) => {
            if (machine.actions.includes(selectedAction.name)) {
              dispatch(machineActions[actionMethod](machine.system_id));
            }
          });
        }
        setSelectedAction(null);
      }}
      saving={saving}
      saved={saved}
    />
  );
};

export default ActionForm;
