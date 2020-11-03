import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "app/machines/views/MachineDetails/MachineSummary";
import { machine as machineActions } from "app/base/actions";
import type { RouteParams } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import type { MachineAction } from "app/store/general/types";
import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import FieldlessForm from "./FieldlessForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import SetPoolForm from "./SetPoolForm";
import SetZoneForm from "./SetZoneForm";
import TagForm from "./TagForm";
import TestForm from "./TestForm";

const getErrorSentence = (action: MachineAction, count: number) => {
  const machineString = pluralize("machine", count, true);

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
  setSelectedAction: SetSelectedAction;
};

export const ActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const [actionDisabled, setActionDisabled] = useState(false);
  const { machinesToAction, processingCount } = useMachineActionForm(
    selectedAction.name
  );
  const actionableMachineIDs = selectedAction
    ? machinesToAction.reduce((machineIDs, machine) => {
        if (machine.actions.includes(selectedAction.name)) {
          machineIDs.push(machine.system_id);
        }
        return machineIDs;
      }, [])
    : [];

  useEffect(() => {
    if (machinesToAction.length === 0) {
      // All the machines were deselected so close the form.
      setSelectedAction(null);
    }
  }, [machinesToAction, setSelectedAction]);

  useEffect(() => {
    // The action should be disabled if not all the selected machines can perform
    // the selected action. When machines are processing the available actions
    // can change, so the action should not be disabled while processing.
    const newActionDisabled =
      !id &&
      processingCount === 0 &&
      actionableMachineIDs.length !== machinesToAction.length;
    setActionDisabled(newActionDisabled);
  }, [
    actionableMachineIDs.length,
    id,
    machinesToAction.length,
    processingCount,
  ]);

  const getFormComponent = () => {
    if (selectedAction && selectedAction.name) {
      switch (selectedAction.name) {
        case "commission":
          return <CommissionForm setSelectedAction={setSelectedAction} />;
        case "deploy":
          return <DeployForm setSelectedAction={setSelectedAction} />;
        case "mark-broken":
          return <MarkBrokenForm setSelectedAction={setSelectedAction} />;
        case "override-failed-testing":
          return <OverrideTestForm setSelectedAction={setSelectedAction} />;
        case "set-pool":
          return <SetPoolForm setSelectedAction={setSelectedAction} />;
        case "set-zone":
          return <SetZoneForm setSelectedAction={setSelectedAction} />;
        case "tag":
          return <TagForm setSelectedAction={setSelectedAction} />;
        case "test":
          return (
            <TestForm
              hardwareType={selectedAction.hardwareType}
              setSelectedAction={setSelectedAction}
            />
          );
        default:
          return (
            <FieldlessForm
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
          machinesToAction.length - actionableMachineIDs.length
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
};

export default ActionFormWrapper;
