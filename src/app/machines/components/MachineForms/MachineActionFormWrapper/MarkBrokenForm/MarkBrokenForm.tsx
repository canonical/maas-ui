import { useEffect } from "react";

import { useDispatch } from "react-redux";
import * as Yup from "yup";

import MarkBrokenFormFields from "./MarkBrokenFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";

const MarkBrokenSchema = Yup.object().shape({
  comment: Yup.string(),
});

type MarkBrokenFormValues = {
  comment: string;
};

type Props = MachineActionFormProps;

export const MarkBrokenForm = ({
  clearSidePanelContent,
  errors,
  machines,
  processingCount,
  searchFilter,
  selectedCount,
  selectedMachines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm<MarkBrokenFormValues, MachineEventErrors>
      actionName={NodeActions.MARK_BROKEN}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        comment: "",
      }}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Mark broken",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.markBroken, {
            message: values.comment,
          });
        } else {
          machines?.forEach((machine) => {
            dispatch(
              machineActions.markBroken({
                message: values.comment,
                system_id: machine.system_id,
              })
            );
          });
        }
      }}
      onSuccess={clearSidePanelContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : selectedCount ?? 0}
      validationSchema={MarkBrokenSchema}
      {...actionProps}
    >
      <MarkBrokenFormFields
        selectedCount={machines ? machines.length : selectedCount ?? 0}
      />
    </ActionForm>
  );
};

export default MarkBrokenForm;
