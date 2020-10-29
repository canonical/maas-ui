import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { machine as machineActions } from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import { useMachineActionForm } from "app/machines/hooks";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import MarkBrokenFormFields from "./MarkBrokenFormFields";

const MarkBrokenSchema = Yup.object().shape({
  comment: Yup.string(),
});

type MarkBrokenFormValues = {
  comment: string;
};

type Props = {
  setSelectedAction: (action: MachineAction | null, deselect?: boolean) => void;
};

export const MarkBrokenForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machineErrors = useSelector(machineSelectors.errors);
  const errors = Object.keys(machineErrors).length > 0 ? machineErrors : null;
  const { machinesToAction, processingCount } = useMachineActionForm(
    "mark-broken"
  );

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm
      actionName="mark-broken"
      allowAllEmpty
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        comment: "",
      }}
      modelName="machine"
      onSubmit={(values: MarkBrokenFormValues) => {
        machinesToAction.forEach((machine) => {
          dispatch(
            machineActions.markBroken(machine.system_id, values.comment)
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
  setSelectedAction: PropTypes.func.isRequired,
};

export default MarkBrokenForm;
