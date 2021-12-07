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

import NodeActionFormWrapper from "app/base/components/node/NodeActionFormWrapper";
import type { HardwareType } from "app/base/enum";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors, { statusSelectors } from "app/store/machine/selectors";
import { ACTIONS } from "app/store/machine/slice";
import type { Machine, MachineActions } from "app/store/machine/types";
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
  const commonFormProps = {
    clearHeaderContent,
    errors,
    machines,
    processingCount,
    viewingDetails,
  };

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
