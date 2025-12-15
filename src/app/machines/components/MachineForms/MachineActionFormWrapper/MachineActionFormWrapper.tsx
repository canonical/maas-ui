import type { ReactElement } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import type { Action, Dispatch } from "redux";

import CloneForm from "./CloneForm";
import CommissionForm from "./CommissionForm";
import DeployForm from "./DeployForm";
import MarkBrokenForm from "./MarkBrokenForm";
import OverrideTestForm from "./OverrideTestForm";
import ReleaseForm from "./ReleaseForm";
import SetMachineZoneForm from "./SetMachineZoneForm/SetMachineZoneForm";
import SetPoolForm from "./SetPoolForm";
import TagForm from "./TagForm";
import TestMachineForm from "./TestMachineForm";

import DeleteForm from "@/app/base/components/node/DeleteForm";
import FieldlessForm from "@/app/base/components/node/FieldlessForm";
import NodeActionWarning from "@/app/base/components/node/NodeActionWarning";
import PowerOffForm from "@/app/base/components/node/PowerOffForm";
import type { HardwareType } from "@/app/base/enum";
import { useScrollOnRender } from "@/app/base/hooks";
import type { ClearSidePanelContent, SetSearchFilter } from "@/app/base/types";
import urls from "@/app/base/urls";
import type { MachineActionFormProps } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import type { MachineActions } from "@/app/store/machine/types";
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

type Props = ContainerProps &
  Omit<
    ReturnType<typeof useSelectedMachinesActionsDispatch>,
    "dispatch" | "failedSystemIds" | "successCount"
  > & {
    clearSelectedMachines: () => void;
    dispatchForSelectedMachines: ReturnType<
      typeof useSelectedMachinesActionsDispatch
    >["dispatch"];
    filter: ReturnType<typeof selectedToFilters>;
    onRenderRef: ReturnType<typeof useScrollOnRender<HTMLDivElement>>;
  };

export const MachineActionForm = ({
  action,
  actionErrors,
  actionStatus,
  applyConfiguredNetworking,
  clearSelectedMachines,
  clearSidePanelContent,
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
}: Props): ReactElement => {
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

    return formComponents[action]();
  };

  const formComponents = {
    [NodeActions.CLONE]: () => (
      <CloneForm
        setSearchFilter={setSearchFilter}
        {...commonMachineFormProps}
      />
    ),
    [NodeActions.COMMISSION]: () => (
      <CommissionForm {...commonMachineFormProps} />
    ),
    [NodeActions.DELETE]: () => (
      <DeleteForm
        onAfterSuccess={clearSelectedMachines}
        onSubmit={() => {
          dispatchForSelectedMachines(machineActions.delete);
        }}
        redirectURL={urls.machines.index}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.DEPLOY]: () => <DeployForm {...commonMachineFormProps} />,
    [NodeActions.MARK_BROKEN]: () => (
      <MarkBrokenForm {...commonMachineFormProps} />
    ),
    [NodeActions.OVERRIDE_FAILED_TESTING]: () => (
      <OverrideTestForm {...commonMachineFormProps} />
    ),
    [NodeActions.RELEASE]: () => <ReleaseForm {...commonMachineFormProps} />,
    // <====== REFACTORING CHANGES HANDS HERE ======>
    [NodeActions.SET_POOL]: () => (
      <SetPoolForm isViewingDetails={viewingDetails} />
    ),
    [NodeActions.SET_ZONE]: () => (
      <SetMachineZoneForm isViewingDetails={viewingDetails} />
    ),
    [NodeActions.TAG]: () => <TagForm isViewingDetails={false} />,
    [NodeActions.UNTAG]: () => <TagForm isViewingDetails={false} />,
    [NodeActions.TEST]: () => (
      <TestMachineForm
        applyConfiguredNetworking={applyConfiguredNetworking}
        hardwareType={hardwareType}
        isViewingDetails={viewingDetails}
      />
    ),
    [NodeActions.ABORT]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.ACQUIRE]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.EXIT_RESCUE_MODE]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.LOCK]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.MARK_FIXED]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.ON]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.RESCUE_MODE]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.UNLOCK]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.POWER_CYCLE]: () => (
      <FieldlessForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.OFF]: () => (
      <PowerOffForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    [NodeActions.SOFT_OFF]: () => (
      <PowerOffForm
        action={action}
        actions={machineActions}
        {...commonNodeFormProps}
      />
    ),
    // No form should be opened for this, as it should only
    // be available for machine details, and will be dispatched
    // immediately on click.
    [NodeActions.CHECK_POWER]: () => null,
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
}: ContainerProps): React.ReactElement | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const dispatch = useDispatch<Dispatch<Action>>();
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
