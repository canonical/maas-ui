import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

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
import { useCycled, useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors, { statusSelectors } from "app/store/machine/selectors";
import { ACTIONS } from "app/store/machine/slice";
import type {
  Machine,
  MachineActions,
  MachineMeta,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { canOpenActionForm } from "app/store/utils/node";
import { kebabToCamelCase } from "app/utils";

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

const getProcessingCount = (
  selectedMachines: Machine[],
  processingMachines: Machine[],
  action: MachineActions
) => {
  if (action === NodeActions.CLONE) {
    // Cloning in the UI works inverse to the rest of the machine actions - we
    // select the destination machines first, then select the machine to perform
    // the clone action, so we don't care what the selected machines are here.
    return processingMachines.length;
  }
  return processingMachines.reduce<number>((count, processingMachine) => {
    const machineInSelection = selectedMachines.some(
      (machine) => machine.system_id === processingMachine.system_id
    );
    return machineInSelection ? count + 1 : count;
  }, 0);
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
  const actionStatus = ACTIONS.find(({ name }) => name === action)?.status;
  const processingMachines = useSelector(
    actionStatus ? statusSelectors[actionStatus] : () => []
  );
  // The form expects one error, so we only show the latest error with the
  // assumption that all selected machines fail in the same way.
  const errors = useSelector((state: RootState) =>
    machineSelectors.eventErrorsForIds(
      state,
      machines.map(({ system_id }) => system_id),
      kebabToCamelCase(action)
    )
  )[0]?.error;
  const processingCount = getProcessingCount(
    machines,
    processingMachines,
    action
  );
  const [actionStarted] = useCycled(processingCount !== 0);
  const actionableMachineIDs = machines.reduce<Machine[MachineMeta.PK][]>(
    (machineIDs, machine) =>
      canOpenActionForm(machine, action)
        ? [...machineIDs, machine.system_id]
        : machineIDs,
    []
  );
  // Show a warning if not all the selected machines can perform the selected
  // action, unless an action has already been started in which case we want to
  // maintain the form being rendered.
  const showWarning =
    !viewingDetails &&
    !actionStarted &&
    actionableMachineIDs.length !== machines.length;
  const commonFormProps = {
    clearHeaderContent,
    errors,
    machines,
    processingCount,
    viewingDetails,
  };

  useEffect(() => {
    if (machines.length === 0) {
      // All the machines were deselected so close the form.
      clearHeaderContent();
    }
  }, [clearHeaderContent, machines.length]);

  const getFormComponent = () => {
    switch (action) {
      case NodeActions.CLONE:
        return (
          <CloneForm setSearchFilter={setSearchFilter} {...commonFormProps} />
        );
      case NodeActions.COMMISSION:
        return <CommissionForm {...commonFormProps} />;
      case NodeActions.DEPLOY:
        return <DeployForm {...commonFormProps} />;
      case NodeActions.MARK_BROKEN:
        return <MarkBrokenForm {...commonFormProps} />;
      case NodeActions.OVERRIDE_FAILED_TESTING:
        return <OverrideTestForm {...commonFormProps} />;
      case NodeActions.RELEASE:
        return <ReleaseForm {...commonFormProps} />;
      case NodeActions.SET_POOL:
        return <SetPoolForm {...commonFormProps} />;
      case NodeActions.SET_ZONE:
        return <SetZoneForm {...commonFormProps} />;
      case NodeActions.TAG:
        return <TagForm {...commonFormProps} />;
      case NodeActions.TEST:
        return (
          <TestForm
            applyConfiguredNetworking={applyConfiguredNetworking}
            hardwareType={hardwareType}
            {...commonFormProps}
          />
        );
      default:
        return <FieldlessForm action={action} {...commonFormProps} />;
    }
  };

  return (
    <div ref={onRenderRef}>
      {showWarning ? (
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
      ) : (
        getFormComponent()
      )}
    </div>
  );
};

export default ActionFormWrapper;
