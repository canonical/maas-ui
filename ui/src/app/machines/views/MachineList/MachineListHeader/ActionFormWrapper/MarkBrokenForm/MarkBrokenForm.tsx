import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import MarkBrokenFormFields from "./MarkBrokenFormFields";
import { machine as machineActions } from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";

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

  const selectedMachines = useSelector(machineSelectors.selected);
  const machineErrors = useSelector(machineSelectors.errors);
  const errors = Object.keys(machineErrors).length > 0 ? machineErrors : null;

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm
      actionName="mark-broken"
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        comment: "",
      }}
      modelName="machine"
      onSubmit={(values: MarkBrokenFormValues) => {
        selectedMachines.forEach((machine) => {
          dispatch(
            machineActions.markBroken(machine.system_id, values.comment)
          );
        });
      }}
      selectedCount={selectedMachines.length}
      validationSchema={MarkBrokenSchema}
    >
      <MarkBrokenFormFields selectedCount={selectedMachines.length} />
    </ActionForm>
  );
};

MarkBrokenForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default MarkBrokenForm;
