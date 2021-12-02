import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SetPoolFormFields from "./SetPoolFormFields";
import type { SetPoolFormValues } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Machine, MachineEventErrors } from "app/store/machine/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { NodeActions } from "app/store/types/node";

type Props = {
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
  machines: Machine[];
  viewingDetails: boolean;
};

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({
  actionDisabled,
  clearHeaderContent,
  machines,
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
  const { errors: machineErrors, processingCount } = useMachineActionForm(
    NodeActions.SET_POOL
  );
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
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={initialValues}
      loaded={resourcePoolsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Set pool",
      }}
      onSubmit={(values) => {
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
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={SetPoolSchema}
    >
      <SetPoolFormFields />
    </ActionForm>
  );
};

export default SetPoolForm;
