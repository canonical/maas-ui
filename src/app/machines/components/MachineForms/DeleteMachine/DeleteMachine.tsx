import type { ReactElement } from "react";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import type { Action, Dispatch } from "redux";

import ActionForm from "@/app/base/components/ActionForm";
import NodeActionConfirmationText from "@/app/base/components/NodeActionConfirmationText";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { EmptyObject } from "@/app/base/types";
import urls from "@/app/base/urls";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import { FilterMachines } from "@/app/store/machine/utils";
import {
  useMachineSelectedCount,
  useSelectedMachinesActionsDispatch,
} from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";
import { capitaliseFirst } from "@/app/utils";

type DeleteMachineProps = {
  isViewingDetails: boolean;
};

export const DeleteMachine = ({
  isViewingDetails,
}: DeleteMachineProps): ReactElement => {
  const dispatch = useDispatch<Dispatch<Action>>();
  const location = useLocation();
  const { closeSidePanel } = useSidePanel();

  const [searchFilter, _] = useState(
    FilterMachines.filtersToString(
      FilterMachines.queryStringToFilters(location.search)
    )
  );

  const selectedMachines = useSelector(machineSelectors.selected);
  const { selectedCount } = useMachineSelectedCount(
    FilterMachines.parseFetchFilters(searchFilter)
  );

  const {
    dispatch: dispatchForSelectedMachines,
    actionStatus,
    actionErrors,
  } = useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });

  const handleSubmit = () => {
    dispatchForSelectedMachines(machineActions.delete);
  };

  const clearSelectedMachines = () => {
    dispatch(machineActions.setSelected(null));
    dispatch(machineActions.invalidateQueries());
  };

  return (
    <ActionForm<EmptyObject>
      actionName={NodeActions.DELETE}
      actionStatus={actionStatus}
      allowUnchanged
      cleanup={machineActions.cleanup}
      errors={actionErrors}
      initialValues={{}}
      modelName="machine"
      onCancel={closeSidePanel}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst("machine")} ${
          isViewingDetails ? "details" : "list"
        } action form`,
        label: "Delete",
      }}
      onSubmit={handleSubmit}
      onSuccess={() => {
        closeSidePanel();
        clearSelectedMachines();
      }}
      processingCount={actionStatus === "loading" ? selectedCount : 0}
      savedRedirect={isViewingDetails ? urls.machines.index : undefined}
      selectedCount={selectedCount}
      submitAppearance="negative"
    >
      <NodeActionConfirmationText
        action={NodeActions.DELETE}
        modelName="machine"
        selectedCount={selectedCount}
      />
    </ActionForm>
  );
};

export default DeleteMachine;
