import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import FieldlessForm from "./FieldlessForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import ReleaseForm from "./ReleaseForm";
import SetPoolForm from "./SetPoolForm";
import SetZoneForm from "./SetZoneForm";
import TagForm from "./TagForm";
import TestForm from "./TestForm";

import { useScrollOnRender } from "app/base/hooks";
import { useMachineActionForm } from "app/machines/hooks";
import type {
  SelectedAction,
  SetSelectedAction,
} from "app/machines/views/MachineDetails/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
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
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const activeMachineId = useSelector(machineSelectors.activeID);
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
  // The action should be disabled if not all the selected machines can perform
  // the selected action. When machines are processing the available actions
  // can change, so the action should not be disabled while processing.
  const actionDisabled =
    !activeMachineId &&
    processingCount === 0 &&
    actionableMachineIDs.length !== machinesToAction.length;

  useEffect(() => {
    if (machinesToAction.length === 0) {
      // All the machines were deselected so close the form.
      setSelectedAction(null);
    }
  }, [machinesToAction, setSelectedAction]);

  const getFormComponent = () => {
    if (selectedAction && selectedAction.name) {
      switch (selectedAction.name) {
        case NodeActions.COMMISSION:
          return (
            <CommissionForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.DEPLOY:
          return (
            <DeployForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.MARK_BROKEN:
          return (
            <MarkBrokenForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.OVERRIDE_FAILED_TESTING:
          return (
            <OverrideTestForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.RELEASE:
          return (
            <ReleaseForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.SET_POOL:
          return (
            <SetPoolForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.SET_ZONE:
          return (
            <SetZoneForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.TAG:
          return (
            <TagForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
            />
          );
        case NodeActions.TEST:
          return (
            <TestForm
              actionDisabled={actionDisabled}
              setSelectedAction={setSelectedAction}
              {...selectedAction.formProps}
            />
          );
        default:
          return (
            <FieldlessForm
              actionDisabled={actionDisabled}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
          );
      }
    }
    return null;
  };

  return (
    <div ref={onRenderRef}>
      {actionDisabled ? (
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
      ) : null}
      {/* Always render the form component so the action can be cleared when it
      saves. This is to prevent race conditions from disabling the form and stopping the 
      save effect from running. */}
      {getFormComponent()}
    </div>
  );
};

ActionFormWrapper.propTypes = {
  selectedAction: PropTypes.object,
  setSelectedAction: PropTypes.func.isRequired,
};

export default ActionFormWrapper;
