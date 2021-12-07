import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SetPoolFormFields from "./SetPoolFormFields";
import type { SetPoolFormValues } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { NodeActions } from "app/store/types/node";

type Props = MachineActionFormProps;

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({
  actionDisabled,
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<SetPoolFormValues>({
    poolSelection: "select",
    description: "",
    name: "",
  });
  const poolErrors = useSelector(resourcePoolSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const errorsToShow =
    Object.keys(errors || {}).length > 0 ? errors : poolErrors;

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
      errors={errorsToShow}
      initialValues={initialValues}
      loaded={resourcePoolsLoaded}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Set pool",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (values.poolSelection === "create") {
          dispatch(
            resourcePoolActions.createWithMachines({
              machineIDs: machines.map(({ system_id }) => system_id),
              pool: values,
            })
          );
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            machines.forEach((machine) => {
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
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={SetPoolSchema}
    >
      <SetPoolFormFields />
    </ActionForm>
  );
};

export default SetPoolForm;
