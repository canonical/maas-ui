import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import pluralize from "pluralize";
import React, { useEffect } from "react";

import {
  general as generalActions,
  machine as machineActions,
} from "app/base/actions";
import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";
import DeployFormFields from "./DeployFormFields";

const DeploySchema = Yup.object().shape({
  oSystem: Yup.string().required("OS is required"),
  release: Yup.string().required("Release is required"),
  kernel: Yup.string(),
  installKVM: Yup.boolean(),
});

export const DeployForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const errors = useSelector(machineSelectors.errors);

  const defaultMinHweKernel = useSelector(
    generalSelectors.defaultMinHweKernel.get
  );
  const osInfo = useSelector(generalSelectors.osInfo.get);

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

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
      onCancel={() => setSelectedAction(null)}
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
        setSelectedAction(null);
      }}
      saving={saving}
      saved={saved}
      validationSchema={DeploySchema}
    >
      <DeployFormFields />
    </FormikForm>
  );
};

export default DeployForm;
