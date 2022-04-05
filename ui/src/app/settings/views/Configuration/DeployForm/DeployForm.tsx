import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { DeployFormValues } from "./types";
import { formatTimeSpanStringToMinutes } from "./utils";

import FormikForm from "app/base/components/FormikForm";
import DeployFormFields from "app/settings/views/Configuration/DeployFormFields";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const DeploySchema = Yup.object().shape({
  default_osystem: Yup.string(),
  commissioning_distro_series: Yup.string(),
  hardware_sync_interval: Yup.number().min(1),
});

const DeployForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const defaultOSystem = useSelector(configSelectors.defaultOSystem);
  const defaultDistroSeries = useSelector(configSelectors.defaultDistroSeries);
  const hardwareSyncInterval = useSelector(
    configSelectors.hardwareSyncInterval
  );
  const hardwareSyncIntervalMinutes =
    formatTimeSpanStringToMinutes(hardwareSyncInterval);

  return (
    <FormikForm<DeployFormValues>
      aria-label="deploy configuration"
      buttonsAlign="left"
      buttonsBordered={false}
      initialValues={{
        default_osystem: defaultOSystem || "",
        default_distro_series: defaultDistroSeries || "",
        hardware_sync_interval: `${hardwareSyncIntervalMinutes}` || "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Deploy form",
      }}
      onSubmit={(values, { resetForm }) => {
        const configValues = {
          ...values,
          ...(values.hardware_sync_interval && {
            hardware_sync_interval: `${values.hardware_sync_interval}m`,
          }),
        };
        dispatch(updateConfig(configValues));
        resetForm({ values });
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
