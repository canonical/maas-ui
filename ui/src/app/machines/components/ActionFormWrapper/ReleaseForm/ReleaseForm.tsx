import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ReleaseFormFields from "./ReleaseFormFields";

import ActionForm from "app/base/components/ActionForm";
import { useMachineActionForm } from "app/machines/hooks";
import type { SetSelectedAction } from "app/machines/views/MachineDetails/types";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
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

type Props = {
  actionDisabled?: boolean;
  setSelectedAction: SetSelectedAction;
};

export const ReleaseForm = ({
  actionDisabled,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const configLoaded = useSelector(configSelectors.loaded);
  const enableErase = useSelector(configSelectors.enableDiskErasing);
  const quickErase = useSelector(configSelectors.diskEraseWithQuick);
  const secureErase = useSelector(configSelectors.diskEraseWithSecure);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.RELEASE
  );

  useEffect(() => {
    dispatch(configActions.fetch());

    return () => {
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);
  return configLoaded ? (
    <ActionForm
      actionDisabled={actionDisabled}
      actionName={NodeActions.RELEASE}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        enableErase: enableErase,
        quickErase: enableErase && quickErase,
        secureErase: enableErase && secureErase,
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Release machine",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Release",
      }}
      onSubmit={(values: ReleaseFormValues) => {
        const { enableErase, quickErase, secureErase } = values;
        const extra = {
          erase: enableErase,
          quick_erase: enableErase && quickErase,
          secure_erase: enableErase && secureErase,
        };
        machinesToAction.forEach((machine) => {
          dispatch(machineActions.release(machine.system_id, extra));
        });
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={ReleaseSchema}
    >
      <Strip shallow>
        <ReleaseFormFields machines={machinesToAction} />
      </Strip>
    </ActionForm>
  ) : (
    <Spinner text="Loading..." />
  );
};

ReleaseForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default ReleaseForm;
