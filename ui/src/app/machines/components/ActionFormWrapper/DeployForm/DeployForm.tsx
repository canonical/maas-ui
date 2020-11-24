import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import DeployFormFields from "./DeployFormFields";

import { general as generalActions } from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import { useSendAnalytics } from "app/base/hooks";
import { useMachineActionForm } from "app/machines/hooks";
import generalSelectors from "app/store/general/selectors";
import type { MachineAction } from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";

const DeploySchema = Yup.object().shape({
  oSystem: Yup.string().required("OS is required"),
  release: Yup.string().required("Release is required"),
  kernel: Yup.string(),
  includeUserData: Yup.boolean(),
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
  const activeMachine = useSelector(machineSelectors.active);
  const errors = useSelector(machineSelectors.errors);
  const defaultMinHweKernel = useSelector(
    generalSelectors.defaultMinHweKernel.get
  );
  const { default_osystem, default_release, osystems, releases } = useSelector(
    generalSelectors.osInfo.get
  );
  const defaultMinHweKernelLoaded = useSelector(
    generalSelectors.defaultMinHweKernel.loaded
  );
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const sendAnalytics = useSendAnalytics();
  const { machinesToAction, processingCount } = useMachineActionForm("deploy");

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  // Default OS+release is set in the backend even if the image has not yet been
  // downloaded. The following conditionals check whether the OS+release actually
  // exist in state before setting initial values in the form.
  let initialOS = "";
  let initialRelease = "";
  if (osystems?.some((osChoice) => osChoice[0] === default_osystem)) {
    initialOS = default_osystem;
  }
  if (
    releases?.some((releaseChoice) => {
      const split = releaseChoice[0].split("/");
      return split.length > 1 && split[1] === default_release;
    })
  ) {
    initialRelease = default_release;
  }

  return (
    <ActionForm
      actionName="deploy"
      allowUnchanged={osystems?.length !== 0 && releases?.length !== 0}
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        oSystem: initialOS,
        release: initialRelease,
        kernel: defaultMinHweKernel || "",
        includeUserData: false,
        installKVM: false,
      }}
      loaded={defaultMinHweKernelLoaded && osInfoLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Deploy",
      }}
      onSubmit={(values: DeployFormValues) => {
        const hasUserData =
          values.includeUserData && values.userData && values.userData !== "";
        const extra = {
          osystem: values.oSystem,
          distro_series: values.release,
          install_kvm: values.installKVM,
          hwe_kernel: values.kernel,
          ...(hasUserData && { user_data: values.userData }),
        };
        if (hasUserData) {
          sendAnalytics(
            "Machine list deploy form",
            "Has cloud-init config",
            "Cloud-init user data"
          );
        }
        machinesToAction.forEach((machine) => {
          dispatch(machineActions.deploy(machine.system_id, extra));
        });
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
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
