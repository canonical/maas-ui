import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import * as Yup from "yup";

import SetPoolFormFields from "./SetPoolFormFields";
import type { SetPoolFormValues } from "./types";

import { useCreatePool, usePools } from "@/app/api/query/pools";
import type { ResourcePoolResponse } from "@/app/apiclient";
import ActionForm from "@/app/base/components/ActionForm";
import type { APIError } from "@/app/base/types";
import type { MachineActionFormProps } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import type { MachineEventErrors } from "@/app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";

type Props = MachineActionFormProps;

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({
  clearSidePanelContent,
  errors,
  machines,
  processingCount,
  selectedCount,
  searchFilter,
  selectedMachines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const [initialValues, setInitialValues] = useState<SetPoolFormValues>({
    poolSelection: "select",
    description: "",
    name: "",
  });
  const resourcePools = usePools();
  const createPool = useCreatePool();
  const errorsToShow =
    Object.keys(errors || {}).length > 0
      ? errors
      : (resourcePools.error as APIError);

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm<SetPoolFormValues, MachineEventErrors>
      actionName={NodeActions.SET_POOL}
      cleanup={machineActions.cleanup}
      errors={errorsToShow}
      initialValues={initialValues}
      loaded={!resourcePools.isPending}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Set pool",
      }}
      onSubmit={async (values) => {
        dispatch(machineActions.cleanup());
        let pool = resourcePools.data?.items.find(
          (pool) => pool.name === values.name
        ) as ResourcePoolResponse;
        if (values.poolSelection === "create") {
          pool = await createPool.mutateAsync({
            body: { name: values.name, description: values.description },
          });
        }

        if (!pool) return;

        selectedMachines
          ? dispatchForSelectedMachines(machineActions.setPool, {
              pool_id: pool.id,
            })
          : machines?.forEach((machine) =>
              dispatch(
                machineActions.setPool({
                  pool_id: pool.id,
                  system_id: machine.system_id,
                })
              )
            );

        // Store the values in case there are errors and the form needs to be
        // displayed again.
        setInitialValues(values);
      }}
      onSuccess={clearSidePanelContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : (selectedCount ?? 0)}
      validationSchema={SetPoolSchema}
      {...actionProps}
    >
      <SetPoolFormFields />
    </ActionForm>
  );
};

export default SetPoolForm;
