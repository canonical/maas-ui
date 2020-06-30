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
import { useProcessing } from "app/base/hooks";
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
  const osInfo = useSelector(generalSelectors.osInfo.get);
  const deployingSelected = useSelector(machineSelectors.deployingSelected);

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  useProcessing(
    deployingSelected.length,
    () => {
      setProcessing(false);
      setSelectedAction(null);
    },
    Object.keys(errors).length > 0,
    () => setProcessing(false)
  );

  return (
    <FormikForm
      allowUnchanged
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{
        oSystem: osInfo.default_osystem,
        release: osInfo.default_release,
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
