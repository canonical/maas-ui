import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import type { DeployFormValues } from "./types";

import FormikForm from "@/app/base/components/FormikForm";
import { useHasEntitlements } from "@/app/base/hooks";
import DeployFormFields from "@/app/settings/views/Configuration/DeployFormFields";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { timeSpanToMinutes } from "@/app/utils";

const DeploySchema = Yup.object().shape({
  default_osystem: Yup.string(),
  commissioning_distro_series: Yup.string(),
  hardware_sync_interval: Yup.number().min(
    1,
    "Hardware sync interval must be at least 1 minute"
  ),
});

const DeployForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const defaultOSystem = useSelector(configSelectors.defaultOSystem);
  const defaultDistroSeries = useSelector(configSelectors.defaultDistroSeries);
  const hardwareSyncInterval = useSelector(
    configSelectors.hardwareSyncInterval
  );
  const hardwareSyncIntervalMinutes = timeSpanToMinutes(hardwareSyncInterval);
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_CONFIGURATIONS]);

  return (
    <FormikForm<DeployFormValues>
      aria-label="deploy configuration"
      cleanup={configActions.cleanup}
      editable={canEdit}
      errors={errors}
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
      saved={saved}
      saving={saving}
      validationSchema={DeploySchema}
    >
      <DeployFormFields canEdit={canEdit} />
    </FormikForm>
  );
};

export default DeployForm;
