import { useDispatch, useSelector } from "react-redux";

import CloneForm from "./CloneForm";
import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import ReleaseForm from "./ReleaseForm";
import SetPoolForm from "./SetPoolForm";
import TagForm from "./TagForm";

import DeleteForm from "app/base/components/node/DeleteForm";
import FieldlessForm from "app/base/components/node/FieldlessForm";
import NodeActionFormWrapper from "app/base/components/node/NodeActionFormWrapper";
import SetZoneForm from "app/base/components/node/SetZoneForm";
import TestForm from "app/base/components/node/TestForm";
import type { HardwareType } from "app/base/enum";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors, { statusSelectors } from "app/store/machine/selectors";
import { ACTIONS } from "app/store/machine/slice";
import type {
  Machine,
  MachineActions,
  MachineEventErrors,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { kebabToCamelCase } from "app/utils";

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
  const commonMachineFormProps = {
    clearHeaderContent,
    errors,
    machines,
    processingCount,
    viewingDetails,
  };
  const commonNodeFormProps = {
    cleanup: machineActions.cleanup,
    clearHeaderContent,
    errors,
    modelName: "machine",
    nodes: machines,
    processingCount,
    viewingDetails,
  };

  const getFormComponent = () => {
    switch (action) {
      case NodeActions.CLONE:
        return (
          <CloneForm
            setSearchFilter={setSearchFilter}
            {...commonMachineFormProps}
          />
        );
      case NodeActions.COMMISSION:
        return <CommissionForm {...commonMachineFormProps} />;
      case NodeActions.DELETE:
        return (
          <DeleteForm
            onSubmit={() => {
              machines.forEach((machine) => {
                dispatch(machineActions.delete(machine.system_id));
              });
            }}
            redirectURL={machineURLs.machines.index}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.DEPLOY:
        return <DeployForm {...commonMachineFormProps} />;
      case NodeActions.MARK_BROKEN:
        return <MarkBrokenForm {...commonMachineFormProps} />;
      case NodeActions.OVERRIDE_FAILED_TESTING:
        return <OverrideTestForm {...commonMachineFormProps} />;
      case NodeActions.RELEASE:
        return <ReleaseForm {...commonMachineFormProps} />;
      case NodeActions.SET_POOL:
        return <SetPoolForm {...commonMachineFormProps} />;
      case NodeActions.SET_ZONE:
        return (
          <SetZoneForm<MachineEventErrors>
            onSubmit={(zoneID) => {
              dispatch(machineActions.cleanup());
              machines.forEach((machine) => {
                dispatch(
                  machineActions.setZone({
                    systemId: machine.system_id,
                    zoneId: zoneID,
                  })
                );
              });
            }}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.TAG:
        return <TagForm {...commonMachineFormProps} />;
      case NodeActions.TEST:
        return (
          <TestForm<MachineEventErrors>
            applyConfiguredNetworking={applyConfiguredNetworking}
            hardwareType={hardwareType}
            onTest={(args) => {
              dispatch(machineActions.test(args));
            }}
            {...commonNodeFormProps}
          />
        );

      case NodeActions.ABORT:
      case NodeActions.ACQUIRE:
      case NodeActions.EXIT_RESCUE_MODE:
      case NodeActions.LOCK:
      case NodeActions.MARK_FIXED:
      case NodeActions.OFF:
      case NodeActions.ON:
      case NodeActions.RESCUE_MODE:
      case NodeActions.UNLOCK:
        return (
          <FieldlessForm
            action={action}
            actions={machineActions}
            {...commonNodeFormProps}
          />
        );
    }
  };

  return (
    <NodeActionFormWrapper
      action={action}
      clearHeaderContent={clearHeaderContent}
      nodes={machines}
      nodeType="machine"
      processingCount={processingCount}
      onUpdateSelected={(machineIDs) =>
        dispatch(machineActions.setSelected(machineIDs))
      }
      viewingDetails={viewingDetails}
    >
      {getFormComponent()}
    </NodeActionFormWrapper>
  );
};

export default ActionFormWrapper;
