import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { actions as machineActions } from "app/store/machine";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import ActionForm from "app/base/components/ActionForm";
import SetPoolFormFields from "./SetPoolFormFields";

import { NodeActions } from "app/store/types/node";

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
  const activeMachine = useSelector(machineSelectors.active);
  const poolErrors = useSelector(resourcePoolSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const {
    errors: machineErrors,
    machinesToAction,
    processingCount,
  } = useMachineActionForm(NodeActions.SET_POOL);
  const errors =
    Object.keys(machineErrors || {}).length > 0 ? machineErrors : poolErrors;

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
      dispatch(resourcePoolActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm
      actionName={NodeActions.SET_POOL}
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={initialValues}
      loaded={resourcePoolsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Set pool",
      }}
      onSubmit={(values) => {
        if (values.poolSelection === "create") {
          dispatch(
            resourcePoolActions.createWithMachines(values, machinesToAction)
          );
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            machinesToAction.forEach((machine) => {
              dispatch(machineActions.setPool(machine.system_id, pool.id));
            });
          }
        }
        // Store the values in case there are errors and the form needs to be
        // displayed again.
        setInitialValues(values);
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
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
