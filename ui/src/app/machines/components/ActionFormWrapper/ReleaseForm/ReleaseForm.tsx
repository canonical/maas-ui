import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ReleaseFormFields from "./ReleaseFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineEventErrors } from "app/store/machine/types/base";
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
  clearHeaderContent: ClearHeaderContent;
};

export const ReleaseForm = ({
  actionDisabled,
  clearHeaderContent,
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
    <ActionForm<ReleaseFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.RELEASE}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={{
        enableErase: enableErase || false,
        quickErase: (enableErase && quickErase) || false,
        secureErase: (enableErase && secureErase) || false,
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Release machine",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Release",
      }}
      onSubmit={(values) => {
        const { enableErase, quickErase, secureErase } = values;
        const extra = {
          erase: enableErase,
          quick_erase: enableErase && quickErase,
          secure_erase: enableErase && secureErase,
        };
        machinesToAction.forEach((machine) => {
          dispatch(
            machineActions.release({ systemId: machine.system_id, extra })
          );
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
  clearHeaderContent: PropTypes.func.isRequired,
};

export default ReleaseForm;
