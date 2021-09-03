import { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import MarkBrokenFormFields from "./MarkBrokenFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineEventErrors } from "app/store/machine/types/base";
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
};

export const MarkBrokenForm = ({
  actionDisabled,
  clearHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
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
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Mark broken",
      }}
      onSubmit={(values) => {
        machinesToAction.forEach((machine) => {
          dispatch(
            machineActions.markBroken({
              systemId: machine.system_id,
              message: values.comment,
            })
          );
        });
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={MarkBrokenSchema}
    >
      <MarkBrokenFormFields selectedCount={machinesToAction.length} />
    </ActionForm>
  );
};

MarkBrokenForm.propTypes = {
  clearHeaderContent: PropTypes.func.isRequired,
};

export default MarkBrokenForm;
