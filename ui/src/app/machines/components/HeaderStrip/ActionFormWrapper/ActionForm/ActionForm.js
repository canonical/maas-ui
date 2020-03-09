import pluralize from "pluralize";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";
import FormCardButtons from "app/base/components/FormCardButtons";

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

export const ActionForm = ({ selectedAction, setSelectedAction }) => {
  const selectedMachines = useSelector(machineSelectors.selected);

  return (
    <FormCardButtons
      bordered={false}
      onCancel={() => setSelectedAction(null)}
      submitLabel={getSubmitText(selectedAction, selectedMachines.length)}
    />
  );
};

ActionForm.propTypes = {
  selectedAction: PropTypes.object
};

export default ActionForm;
