import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { MachineAction } from "app/store/machine/types";
import ActionForm from "./ActionForm";
import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import OverrideTestForm from "./OverrideTestForm";
import SetPoolForm from "./SetPoolForm";
import SetZoneForm from "./SetZoneForm";
import TagForm from "./TagForm";
import TestForm from "./TestForm";

const getErrorSentence = (action: MachineAction, count: number) => {
  const machineString = `${count} ${pluralize("machine", count)}`;

  switch (action.name) {
    case "exit-rescue-mode":
      return `${machineString} cannot exit rescue mode`;
    case "lock":
      return `${machineString} cannot be locked`;
    case "override-failed-testing":
      return `Cannot override failed tests on ${machineString}`;
    case "rescue-mode":
      return `${machineString} cannot be put in rescue mode`;
    case "set-pool":
      return `Cannot set pool of ${machineString}`;
    case "set-zone":
      return `Cannot set zone of ${machineString}`;
    case "unlock":
      return `${machineString} cannot be unlocked`;
    default:
      return `${machineString} cannot be ${action.sentence}`;
  }
};

type Props = {
  selectedAction: MachineAction;
  setSelectedAction: (action: MachineAction, deselect?: boolean) => void;
  _processing?: boolean;
};

export const ActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
  _processing = false,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  // Initialise the processing state from a prop to allow testing the state change.
  const [processing, setProcessing] = useState(_processing);
  const selectedMachines = useSelector(machineSelectors.selected);
  const actionableMachineIDs = selectedAction
    ? selectedMachines.reduce((machineIDs, machine) => {
        if (machine.actions.includes(selectedAction.name)) {
          machineIDs.push(machine.system_id);
        }
        return machineIDs;
      }, [])
    : [];

  // The action should be disabled if not all the selected machines can perform
  // The selected action. When machines are processing the available actions
  // can change, so the action should not be disabled while processing.
  const actionDisabled =
    !processing && actionableMachineIDs.length !== selectedMachines.length;

  useEffect(() => {
    if (selectedMachines.length === 0) {
      // All the machines were deselected so close the form.
      setSelectedAction(null);
    }
  }, [selectedMachines, setSelectedAction]);

  const getFormComponent = () => {
    if (selectedAction && selectedAction.name) {
      switch (selectedAction.name) {
        case "commission":
          return (
            <CommissionForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "deploy":
          return (
            <DeployForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "override-failed-testing":
          return (
            <OverrideTestForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "set-pool":
          return (
            <SetPoolForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "set-zone":
          return (
            <SetZoneForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "tag":
          return (
            <TagForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        case "test":
          return (
            <TestForm
              processing={processing}
              setProcessing={setProcessing}
              setSelectedAction={setSelectedAction}
            />
          );
        default:
          return (
            <ActionForm
              processing={processing}
              setProcessing={setProcessing}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
          );
      }
    }
    return null;
  };

  return actionDisabled ? (
    <p data-test="machine-action-warning">
      <i className="p-icon--warning" />
      <span className="u-nudge-right--small">
        {getErrorSentence(
          selectedAction,
          selectedMachines.length - actionableMachineIDs.length
        )}
        . To proceed,{" "}
        <Button
          appearance="link"
          data-test="select-actionable-machines"
          inline
          onClick={() =>
            dispatch(machineActions.setSelected(actionableMachineIDs))
          }
        >
          update your selection
        </Button>
        .
      </span>
    </p>
  ) : (
    getFormComponent()
  );
};

ActionFormWrapper.propTypes = {
  selectedAction: PropTypes.object,
  setSelectedAction: PropTypes.func.isRequired,
  _processing: PropTypes.bool,
};

export default ActionFormWrapper;
