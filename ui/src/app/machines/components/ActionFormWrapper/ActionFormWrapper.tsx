import React, { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import FieldlessForm from "./FieldlessForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import SetPoolForm from "./SetPoolForm";
import SetZoneForm from "./SetZoneForm";
import TagForm from "./TagForm";
import TestForm from "./TestForm";

import type { RouteParams } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import type {
  SelectedAction,
  SetSelectedAction,
} from "app/machines/views/MachineDetails/MachineSummary";
import { actions as machineActions } from "app/store/machine";
import { NodeActions } from "app/store/types/node";

const getErrorSentence = (action: SelectedAction, count: number) => {
  const machineString = pluralize("machine", count, true);

  switch (action.name) {
    case NodeActions.EXIT_RESCUE_MODE:
      return `${machineString} cannot exit rescue mode`;
    case NodeActions.LOCK:
      return `${machineString} cannot be locked`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `Cannot override failed tests on ${machineString}`;
    case NodeActions.RESCUE_MODE:
      return `${machineString} cannot be put in rescue mode`;
    case NodeActions.SET_POOL:
      return `Cannot set pool of ${machineString}`;
    case NodeActions.SET_ZONE:
      return `Cannot set zone of ${machineString}`;
    case NodeActions.UNLOCK:
      return `${machineString} cannot be unlocked`;
    default:
      return `${machineString} cannot be ${action.sentence}`;
  }
};

type Props = {
  selectedAction: SelectedAction;
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
        case NodeActions.COMMISSION:
          return <CommissionForm setSelectedAction={setSelectedAction} />;
        case NodeActions.DEPLOY:
          return <DeployForm setSelectedAction={setSelectedAction} />;
        case NodeActions.MARK_BROKEN:
          return <MarkBrokenForm setSelectedAction={setSelectedAction} />;
        case NodeActions.OVERRIDE_FAILED_TESTING:
          return <OverrideTestForm setSelectedAction={setSelectedAction} />;
        case NodeActions.SET_POOL:
          return <SetPoolForm setSelectedAction={setSelectedAction} />;
        case NodeActions.SET_ZONE:
          return <SetZoneForm setSelectedAction={setSelectedAction} />;
        case NodeActions.TAG:
          return <TagForm setSelectedAction={setSelectedAction} />;
        case NodeActions.TEST:
          return (
            <TestForm
              setSelectedAction={setSelectedAction}
              {...selectedAction.formProps}
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
