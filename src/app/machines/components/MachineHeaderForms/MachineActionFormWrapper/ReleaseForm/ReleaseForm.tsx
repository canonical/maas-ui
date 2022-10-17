import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ReleaseFormFields from "./ReleaseFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";

export type ReleaseFormValues = {
  enableErase: boolean;
  quickErase: boolean;
  secureErase: boolean;
};

const ReleaseSchema = Yup.object().shape({
  enableErase: Yup.boolean(),
  quickErase: Yup.boolean(),
  secureErase: Yup.boolean(),
});

type Props = MachineActionFormProps;

export const ReleaseForm = ({
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  searchFilter,
  selectedCount,
  selectedMachines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const configLoaded = useSelector(configSelectors.loaded);
  const enableErase = useSelector(configSelectors.enableDiskErasing);
  const quickErase = useSelector(configSelectors.diskEraseWithQuick);
  const secureErase = useSelector(configSelectors.diskEraseWithSecure);

  useEffect(() => {
    dispatch(configActions.fetch());

    return () => {
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);

  return configLoaded ? (
    <ActionForm<ReleaseFormValues, MachineEventErrors>
      actionName={NodeActions.RELEASE}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        enableErase: enableErase || false,
        quickErase: (enableErase && quickErase) || false,
        secureErase: (enableErase && secureErase) || false,
      }}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Release machine",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Release",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const { enableErase, quickErase, secureErase } = values;
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.release, {
            erase: enableErase,
            quick_erase: enableErase && quickErase,
            secure_erase: enableErase && secureErase,
          });
        } else {
          machines?.forEach((machine) => {
            dispatch(
              machineActions.release({
                erase: enableErase,
                quick_erase: enableErase && quickErase,
                secure_erase: enableErase && secureErase,
                system_id: machine.system_id,
              })
            );
          });
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : selectedCount ?? 0}
      validationSchema={ReleaseSchema}
      {...actionProps}
    >
      <Strip shallow>
        <ReleaseFormFields machines={machines ?? []} />
      </Strip>
    </ActionForm>
  ) : (
    <Spinner text="Loading..." />
  );
};

export default ReleaseForm;
