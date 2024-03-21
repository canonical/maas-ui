import { Spinner } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import type { AnyAction, Dispatch } from "redux";

import CloneForm from "./CloneForm";
import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import ReleaseForm from "./ReleaseForm";
import SetPoolForm from "./SetPoolForm";
import TagForm from "./TagForm";

import DeleteForm from "@/app/base/components/node/DeleteForm";
import FieldlessForm from "@/app/base/components/node/FieldlessForm";
import NodeActionWarning from "@/app/base/components/node/NodeActionWarning";
import PowerOffForm from "@/app/base/components/node/PowerOffForm";
import SetZoneForm from "@/app/base/components/node/SetZoneForm";
import TestForm from "@/app/base/components/node/TestForm";
import type { HardwareType } from "@/app/base/enum";
import { useScrollOnRender } from "@/app/base/hooks";
import type { ClearSidePanelContent, SetSearchFilter } from "@/app/base/types";
import urls from "@/app/base/urls";
import type { MachineActionFormProps } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import type {
  MachineActions,
  MachineEventErrors,
} from "@/app/store/machine/types";
import { selectedToFilters } from "@/app/store/machine/utils";
import { useSelectedMachinesActionsDispatch } from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";

type ContainerProps = Omit<MachineActionFormProps, "processingCount"> & {
  action: MachineActions;
  applyConfiguredNetworking?: boolean;
  clearSidePanelContent: ClearSidePanelContent;
  hardwareType?: HardwareType;
  selectedCountLoading?: boolean;
  setSearchFilter?: SetSearchFilter;
  viewingDetails: boolean;
};

type Props = ContainerProps & {
  clearSelectedMachines: () => void;
  dispatch: Dispatch<AnyAction>;
  dispatchForSelectedMachines: ReturnType<
    typeof useSelectedMachinesActionsDispatch
  >["dispatch"];
  filter: ReturnType<typeof selectedToFilters>;
  onRenderRef: ReturnType<typeof useScrollOnRender<HTMLDivElement>>;
} & Omit<
    ReturnType<typeof useSelectedMachinesActionsDispatch>,
    "failedSystemIds" | "successCount"
  >;

export const MachineActionForm = ({
  action,
  actionErrors,
  actionStatus,
  applyConfiguredNetworking,
  clearSelectedMachines,
  clearSidePanelContent,
  dispatch,
  dispatchForSelectedMachines,
  filter,
  hardwareType,
  onRenderRef,
  searchFilter,
  selectedCount,
  selectedCountLoading,
  selectedMachines,
  setSearchFilter,
  viewingDetails,
}: Props) => {
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
      case NodeActions.OFF:
      case NodeActions.SOFT_OFF:
        return (
          <PowerOffForm
            action={action}
            actions={machineActions}
            {...commonNodeFormProps}
          />
        );
      // No form should be opened for this, as it should only
      // be available for machine details, and will be dispatched
      // immediately on click.
      case NodeActions.CHECK_POWER:
        return null;
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

/**
 * Displays specified machine action form for selected machines.
 */
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
}: ContainerProps): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const dispatch = useDispatch();
  const {
    dispatch: dispatchForSelectedMachines,
    actionStatus,
    actionErrors,
  } = useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });

  const clearSelectedMachines = () => {
    dispatch(machineActions.setSelected(null));
    dispatch(machineActions.invalidateQueries());
  };

  const filter = selectedToFilters(selectedMachines || null);

  return (
    <MachineActionForm
      action={action}
      actionErrors={actionErrors}
      actionStatus={actionStatus}
      applyConfiguredNetworking={applyConfiguredNetworking}
      clearSelectedMachines={clearSelectedMachines}
      clearSidePanelContent={clearSidePanelContent}
      dispatch={dispatch}
      dispatchForSelectedMachines={dispatchForSelectedMachines}
      filter={filter}
      hardwareType={hardwareType}
      onRenderRef={onRenderRef}
      searchFilter={searchFilter}
      selectedCount={selectedCount}
      selectedCountLoading={selectedCountLoading}
      selectedMachines={selectedMachines}
      setSearchFilter={setSearchFilter}
      viewingDetails={viewingDetails}
    />
  );
};

export default MachineActionFormWrapper;
