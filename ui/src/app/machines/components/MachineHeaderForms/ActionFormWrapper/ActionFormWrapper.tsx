import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";

import CloneForm from "./CloneForm";
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

import type { HardwareType } from "app/base/enum";
import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type {
  Machine,
  MachineActions,
  MachineMeta,
} from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";
import { canOpenActionForm } from "app/store/utils/node";

const getErrorSentence = (action: MachineActions, count: number) => {
  const machineString = pluralize("machine", count, true);

  switch (action) {
    case NodeActions.ABORT:
      return `${machineString} cannot abort action`;
    case NodeActions.ACQUIRE:
      return `${machineString} cannot be acquired`;
    case NodeActions.CLONE:
      return `${machineString} cannot be cloned to`;
    case NodeActions.COMMISSION:
      return `${machineString} cannot be commissioned`;
    case NodeActions.DELETE:
      return `${machineString} cannot be deleted`;
    case NodeActions.DEPLOY:
      return `${machineString} cannot be deployed`;
    case NodeActions.EXIT_RESCUE_MODE:
      return `${machineString} cannot exit rescue mode`;
    case NodeActions.LOCK:
      return `${machineString} cannot be locked`;
    case NodeActions.MARK_BROKEN:
      return `${machineString} cannot be marked broken`;
    case NodeActions.MARK_FIXED:
      return `${machineString} cannot be marked fixed`;
    case NodeActions.OFF:
      return `${machineString} cannot be powered off`;
    case NodeActions.ON:
      return `${machineString} cannot be powered on`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `Cannot override failed tests on ${machineString}`;
    case NodeActions.RELEASE:
      return `${machineString} cannot be released`;
    case NodeActions.RESCUE_MODE:
      return `${machineString} cannot be put in rescue mode`;
    case NodeActions.SET_POOL:
      return `Cannot set pool of ${machineString}`;
    case NodeActions.SET_ZONE:
      return `Cannot set zone of ${machineString}`;
    case NodeActions.TAG:
      return `${machineString} cannot be tagged`;
    case NodeActions.TEST:
      return `${machineString} cannot be tested`;
    case NodeActions.UNLOCK:
      return `${machineString} cannot be unlocked`;
    default:
      return `${machineString} cannot perform action`;
  }
};

type Props = {
  action: MachineActions;
  applyConfiguredNetworking?: boolean;
  clearHeaderContent: ClearHeaderContent;
  hardwareType?: HardwareType;
  machines: Machine[];
  setSearchFilter?: SetSearchFilter;
  viewingDetails: boolean;
};

export const ActionFormWrapper = ({
  action,
  applyConfiguredNetworking,
  clearHeaderContent,
  hardwareType,
  machines,
  setSearchFilter,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const { processingCount } = useMachineActionForm(action);
  const actionableMachineIDs = machines.reduce<Machine[MachineMeta.PK][]>(
    (machineIDs, machine) => {
      if (canOpenActionForm(machine, action)) {
        machineIDs.push(machine.system_id);
      }
      return machineIDs;
    },
    []
  );
  // The action should be disabled if not all the selected machines can perform
  // the selected action. When machines are processing the available actions
  // can change, so the action should not be disabled while processing.
  const actionDisabled =
    !viewingDetails &&
    processingCount === 0 &&
    actionableMachineIDs.length !== machines.length;

  useEffect(() => {
    if (machines.length === 0) {
      // All the machines were deselected so close the form.
      clearHeaderContent();
    }
  }, [machines, clearHeaderContent]);

  const getFormComponent = () => {
    switch (action) {
      case NodeActions.CLONE:
        return (
          <CloneForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            setSearchFilter={setSearchFilter}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.COMMISSION:
        return (
          <CommissionForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.DEPLOY:
        return (
          <DeployForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.MARK_BROKEN:
        return (
          <MarkBrokenForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.OVERRIDE_FAILED_TESTING:
        return (
          <OverrideTestForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.RELEASE:
        return (
          <ReleaseForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.SET_POOL:
        return (
          <SetPoolForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.SET_ZONE:
        return (
          <SetZoneForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.TAG:
        return (
          <TagForm
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      case NodeActions.TEST:
        return (
          <TestForm
            actionDisabled={actionDisabled}
            applyConfiguredNetworking={applyConfiguredNetworking}
            clearHeaderContent={clearHeaderContent}
            hardwareType={hardwareType}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
      default:
        return (
          <FieldlessForm
            action={action}
            actionDisabled={actionDisabled}
            clearHeaderContent={clearHeaderContent}
            machines={machines}
            viewingDetails={viewingDetails}
          />
        );
    }
  };

  return (
    <div ref={onRenderRef}>
      {actionDisabled ? (
        <p data-testid="machine-action-warning">
          <i className="p-icon--warning" />
          <span className="u-nudge-right--small">
            {getErrorSentence(
              action,
              machines.length - actionableMachineIDs.length
            )}
            . To proceed,{" "}
            <Button
              appearance="link"
              data-testid="select-actionable-machines"
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

export default ActionFormWrapper;
