import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SetPoolFormFields from "./SetPoolFormFields";
import type { SetPoolFormValues } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "app/store/machine/utils/hooks";
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
      actionName={NodeActions.SET_POOL}
      cleanup={machineActions.cleanup}
      errors={errorsToShow}
      initialValues={initialValues}
      loaded={resourcePoolsLoaded}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Set pool",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (values.poolSelection === "create") {
          if (selectedMachines) {
            dispatchForSelectedMachines(
              resourcePoolActions.createWithMachines,
              {
                pool: values,
              }
            );
          } else {
            dispatch(
              resourcePoolActions.createWithMachines({
                machineIDs: machines?.map(({ system_id }) => system_id) || [],
                pool: values,
              })
            );
          }
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            if (selectedMachines) {
              dispatchForSelectedMachines(machineActions.setPool, {
                pool_id: pool.id,
              });
            } else {
              machines?.forEach((machine) => {
                dispatch(
                  machineActions.setPool({
                    pool_id: pool.id,
                    system_id: machine.system_id,
                  })
                );
              });
            }
          }
        }
        // Store the values in case there are errors and the form needs to be
        // displayed again.
        setInitialValues(values);
      }}
      onSuccess={clearSidePanelContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : selectedCount ?? 0}
      validationSchema={SetPoolSchema}
      {...actionProps}
    >
      <SetPoolFormFields />
    </ActionForm>
  );
};

export default SetPoolForm;
