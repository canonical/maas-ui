import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import {
  machine as machineActions,
  resourcepool as resourcePoolActions,
} from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
} from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";
import SetPoolFormFields from "./SetPoolFormFields";

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    poolSelection: "select",
    description: "",
    name: "",
  });
  const selectedMachines = useSelector(machineSelectors.selected);
  const machineErrors = useSelector(machineSelectors.errors);
  const poolErrors = useSelector(resourcePoolSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const settingPoolSelected = useSelector(machineSelectors.settingPoolSelected);
  const errors =
    Object.keys(machineErrors).length > 0 ? machineErrors : poolErrors;

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
      dispatch(resourcePoolActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm
      actionName="set-pool"
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={initialValues}
      modelName="machine"
      onSubmit={(values) => {
        if (values.poolSelection === "create") {
          const machineIDs = selectedMachines.map(({ system_id }) => system_id);
          dispatch(resourcePoolActions.createWithMachines(values, machineIDs));
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            selectedMachines.forEach((machine) => {
              dispatch(machineActions.setPool(machine.system_id, pool.id));
            });
          }
        }
        // Store the values in case there are errors and the form needs to be
        // displayed again.
        setInitialValues(values);
      }}
      processingCount={settingPoolSelected.length}
      selectedCount={selectedMachines.length}
      validationSchema={SetPoolSchema}
    >
      <SetPoolFormFields />
    </ActionForm>
  );
};

SetPoolForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default SetPoolForm;
