import { useEffect } from "react";

import { useDispatch } from "react-redux";
import * as Yup from "yup";

import MarkBrokenFormFields from "./MarkBrokenFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

const MarkBrokenSchema = Yup.object().shape({
  comment: Yup.string(),
});

type MarkBrokenFormValues = {
  comment: string;
};

type Props = MachineActionFormProps;

export const MarkBrokenForm = ({
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

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
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Mark broken",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        machines.forEach((machine) => {
          dispatch(
            machineActions.markBroken({
              systemId: machine.system_id,
              message: values.comment,
            })
          );
        });
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={MarkBrokenSchema}
    >
      <MarkBrokenFormFields selectedCount={machines.length} />
    </ActionForm>
  );
};

export default MarkBrokenForm;
