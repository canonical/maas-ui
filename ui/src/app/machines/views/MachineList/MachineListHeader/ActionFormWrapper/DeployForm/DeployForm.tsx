import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import {
  general as generalActions,
  machine as machineActions,
} from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import type { Machine } from "app/store/machine/types";
import type { MachineAction } from "app/store/general/types";
import generalSelectors from "app/store/general/selectors";
import ActionForm from "app/base/components/ActionForm";
import DeployFormFields from "./DeployFormFields";

const DeploySchema = Yup.object().shape({
  oSystem: Yup.string().required("OS is required"),
  release: Yup.string().required("Release is required"),
  kernel: Yup.string(),
  installKVM: Yup.boolean(),
});

export type DeployFormValues = {
  includeUserData: boolean;
  installKVM: boolean;
  kernel: string;
  oSystem: string;
  release: string;
  userData?: string;
};

type Props = {
  setSelectedAction: (
    action?: MachineAction | null,
    deselect?: boolean
  ) => void;
};

export const DeployForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const defaultMinHweKernel = useSelector(
    generalSelectors.defaultMinHweKernel.get
  );
  const osInfo = useSelector(generalSelectors.osInfo.get);
  const deployingSelected: Machine["system_id"][] = useSelector(
    machineSelectors.deployingSelected
  );

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm
      actionName="deploy"
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        oSystem: osInfo.default_osystem,
        release: osInfo.default_release,
        kernel: defaultMinHweKernel || "",
        installKVM: false,
      }}
      modelName="machine"
      onSubmit={(values: DeployFormValues) => {
        const extra = {
          osystem: values.oSystem,
          distro_series: values.release,
          install_kvm: values.installKVM,
          hwe_kernel: values.kernel,
          ...(values.includeUserData &&
            values.userData &&
            values.userData !== "" && { user_data: values.userData }),
        };
        selectedMachines.forEach((machine) => {
          dispatch(machineActions.deploy(machine.system_id, extra));
        });
      }}
      processingCount={deployingSelected.length}
      selectedCount={selectedMachines.length}
      validationSchema={DeploySchema}
    >
      <DeployFormFields />
    </ActionForm>
  );
};

DeployForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default DeployForm;
