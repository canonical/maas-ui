import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import {
  general as generalActions,
  machine as machineActions,
} from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import DeployFormFields from "./DeployFormFields";
import generalSelectors from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { MachineAction } from "app/store/general/types";

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
  const { default_osystem, default_release, osystems, releases } = useSelector(
    generalSelectors.osInfo.get
  );
  const deployingSelected = useSelector(machineSelectors.deployingSelected);

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  // Default OS+release is set in the backend even if the image has not yet been
  // downloaded. The following condiionals check whether the OS+release actually
  // exist in state before setting initial values in the form.
  let initialOS = "";
  let initialRelease = "";
  if (osystems.some((osChoice) => osChoice[0] === default_osystem)) {
    initialOS = default_osystem;
  }
  if (
    releases.some((releaseChoice) => {
      const split = releaseChoice[0].split("/");
      return split.length > 1 && split[1] === default_release;
    })
  ) {
    initialRelease = default_release;
  }

  return (
    <ActionForm
      actionName="deploy"
      allowUnchanged={osystems.length !== 0 && releases.length !== 0}
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        oSystem: initialOS,
        release: initialRelease,
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
