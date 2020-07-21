import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { getProcessingLabel } from "../utils";
import {
  general as generalActions,
  machine as machineActions,
} from "app/base/actions";
import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import { useMachinesProcessing } from "app/machines/components/HeaderStrip/hooks";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";
import DeployFormFields from "./DeployFormFields";

const DeploySchema = Yup.object().shape({
  oSystem: Yup.string().required("OS is required"),
  release: Yup.string().required("Release is required"),
  kernel: Yup.string(),
  installKVM: Yup.boolean(),
});

export const DeployForm = ({
  processing,
  setProcessing,
  setSelectedAction,
}) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
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

  useMachinesProcessing(
    deployingSelected,
    setProcessing,
    setSelectedAction,
    Object.keys(errors).length > 0
  );

  // Default OS+release is set in the backend even if the image has not yet been
  // downloaded. The following conditionals check whether the OS+release actually
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
    <FormikForm
      allowUnchanged={osystems.length !== 0 && releases.length !== 0}
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{
        oSystem: initialOS,
        release: initialRelease,
        kernel: defaultMinHweKernel || "",
        installKVM: false,
      }}
      submitLabel={`Deploy ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null, true)}
      onSaveAnalytics={{
        action: "Deploy",
        category: "Take action menu",
        label: "Deploy selected machines",
      }}
      onSubmit={(values) => {
        const extra = {
          osystem: values.oSystem,
          distro_series: values.release,
          install_kvm: values.installKVM,
          hwe_kernel: values.kernel,
        };
        selectedMachines.forEach((machine) => {
          dispatch(machineActions.deploy(machine.system_id, extra));
        });
        setProcessing(true);
      }}
      saving={processing}
      savingLabel={getProcessingLabel(
        deployingSelected.length,
        selectedMachines.length,
        "deploy"
      )}
      saved={saved}
      validationSchema={DeploySchema}
    >
      <DeployFormFields />
    </FormikForm>
  );
};

DeployForm.propTypes = {
  processing: PropTypes.bool,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default DeployForm;
