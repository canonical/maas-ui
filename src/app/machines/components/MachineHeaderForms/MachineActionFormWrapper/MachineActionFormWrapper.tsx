import { Spinner } from "@canonical/react-components";
import { useDispatch } from "react-redux";

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
import NodeActionWarning from "app/base/components/node/NodeActionWarning";
import SetZoneForm from "app/base/components/node/SetZoneForm";
import TestForm from "app/base/components/node/TestForm";
import type { HardwareType } from "app/base/enum";
import { useScrollOnRender } from "app/base/hooks";
import type { ClearSidePanelContent, SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type {
  MachineActions,
  MachineEventErrors,
} from "app/store/machine/types";
import { selectedToFilters } from "app/store/machine/utils";
import { useSelectedMachinesActionsDispatch } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";

type Props = Omit<MachineActionFormProps, "processingCount"> & {
  action: MachineActions;
  applyConfiguredNetworking?: boolean;
  clearSidePanelContent: ClearSidePanelContent;
  hardwareType?: HardwareType;
  selectedCountLoading?: boolean;
  setSearchFilter?: SetSearchFilter;
  viewingDetails: boolean;
};

export const MachineActionFormWrapper = ({
  action,
  applyConfiguredNetworking,
  clearSidePanelContent,
  hardwareType,
  searchFilter,
  selectedCount,
  selectedCountLoading,
  selectedMachines,
  setSearchFilter,
  viewingDetails,
}: Props): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const dispatch = useDispatch();
  const {
    dispatch: dispatchForSelectedMachines,
    actionStatus,
    actionErrors,
  } = useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });

  const commonMachineFormProps = {
    searchFilter,
    clearSidePanelContent,
    viewingDetails,
    selectedMachines,
    actionStatus,
    errors: actionErrors,
    selectedCount,
    selectedCountLoading,
  };
  const commonNodeFormProps = {
    cleanup: machineActions.cleanup,
    clearSidePanelContent,
    modelName: "machine",
    viewingDetails,
    searchFilter,
    selectedMachines,
    actionStatus,
    errors: actionErrors,
    selectedCount,
    selectedCountLoading,
  };
  const clearSelectedMachines = () => {
    dispatch(machineActions.setSelectedMachines(null));
    dispatch(machineActions.invalidateQueries());
  };

  const filter = selectedToFilters(selectedMachines || null);

  const getFormComponent = () => {
    if (!filter) {
      return null;
    }
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
            onAfterSuccess={clearSelectedMachines}
            onSubmit={() => {
              dispatchForSelectedMachines(machineActions.delete);
            }}
            redirectURL={urls.machines.index}
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
              dispatchForSelectedMachines(machineActions.setZone, {
                zone_id: zoneID,
              });
            }}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.TAG:
      case NodeActions.UNTAG:
        return <TagForm {...commonMachineFormProps} />;
      case NodeActions.TEST:
        return (
          <TestForm<MachineEventErrors>
            applyConfiguredNetworking={applyConfiguredNetworking}
            hardwareType={hardwareType}
            onTest={(args) => {
              dispatchForSelectedMachines(machineActions.test, {
                enable_ssh: args.enableSSH,
                script_input: args.scriptInputs,
                testing_scripts: args.scripts.map((script) => script.name),
              });
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

  if (selectedCountLoading) {
    return <Spinner />;
  }

  return (
    <div ref={onRenderRef}>
      {selectedCount === 0 ? (
        <NodeActionWarning
          action={action}
          nodeType={commonNodeFormProps.modelName}
          selectedCount={selectedCount}
        />
      ) : null}
      {getFormComponent()}
    </div>
  );
};

export default MachineActionFormWrapper;
