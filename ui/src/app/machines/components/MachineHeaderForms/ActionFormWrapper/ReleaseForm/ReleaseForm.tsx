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
import type { Machine, MachineEventErrors } from "app/store/machine/types";
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
  machines: Machine[];
  viewingDetails: boolean;
};

export const ReleaseForm = ({
  actionDisabled,
  clearHeaderContent,
  machines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const configLoaded = useSelector(configSelectors.loaded);
  const enableErase = useSelector(configSelectors.enableDiskErasing);
  const quickErase = useSelector(configSelectors.diskEraseWithQuick);
  const secureErase = useSelector(configSelectors.diskEraseWithSecure);
  const { errors, processingCount } = useMachineActionForm(NodeActions.RELEASE);

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
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Release",
      }}
      onSubmit={(values) => {
        const { enableErase, quickErase, secureErase } = values;
        const extra = {
          erase: enableErase,
          quick_erase: enableErase && quickErase,
          secure_erase: enableErase && secureErase,
        };
        machines.forEach((machine) => {
          dispatch(
            machineActions.release({ systemId: machine.system_id, extra })
          );
        });
      }}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={ReleaseSchema}
    >
      <Strip shallow>
        <ReleaseFormFields machines={machines} />
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
