import { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import MarkBrokenFormFields from "./MarkBrokenFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Machine, MachineEventErrors } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

const MarkBrokenSchema = Yup.object().shape({
  comment: Yup.string(),
});

type MarkBrokenFormValues = {
  comment: string;
};

type Props = {
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
  machines: Machine[];
  viewingDetails: boolean;
};

export const MarkBrokenForm = ({
  actionDisabled,
  clearHeaderContent,
  machines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { errors, processingCount } = useMachineActionForm(
    NodeActions.MARK_BROKEN
  );

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm<MarkBrokenFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.MARK_BROKEN}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={{
        comment: "",
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Mark broken",
      }}
      onSubmit={(values) => {
        machines.forEach((machine) => {
          dispatch(
            machineActions.markBroken({
              systemId: machine.system_id,
              message: values.comment,
            })
          );
        });
      }}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={MarkBrokenSchema}
    >
      <MarkBrokenFormFields selectedCount={machines.length} />
    </ActionForm>
  );
};

MarkBrokenForm.propTypes = {
  clearHeaderContent: PropTypes.func.isRequired,
};

export default MarkBrokenForm;
