import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SetPoolFormFields from "./SetPoolFormFields";
import type { SetPoolFormValues } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { ClearSelectedAction } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { NodeActions } from "app/store/types/node";

type Props = {
  actionDisabled?: boolean;
  clearSelectedAction: ClearSelectedAction;
};

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({
  actionDisabled,
  clearSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<SetPoolFormValues>({
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
    <ActionForm<SetPoolFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.SET_POOL}
      cleanup={machineActions.cleanup}
      clearSelectedAction={clearSelectedAction}
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
            resourcePoolActions.createWithMachines({
              machineIDs: machinesToAction.map(({ system_id }) => system_id),
              pool: values,
            })
          );
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            machinesToAction.forEach((machine) => {
              dispatch(
                machineActions.setPool({
                  systemId: machine.system_id,
                  poolId: pool.id,
                })
              );
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

export default SetPoolForm;
