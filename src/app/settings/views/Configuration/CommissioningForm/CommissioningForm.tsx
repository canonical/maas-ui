import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";
import Fields from "../CommissioningFormFields";

import { useConfigurations } from "@/app/api/query/configurations";
import type { PublicConfigName } from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import { useHasEntitlements } from "@/app/base/hooks";
import { getConfigsFromResponse } from "@/app/settings/utils";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { ConfigNames } from "@/app/store/config/types";

const CommissioningSchema = Yup.object().shape({
  commissioning_distro_series: Yup.string(),
  default_min_hwe_kernel: Yup.string(),
});

export enum Labels {
  FormLabel = "Commissioning Form",
}

export const commissioningConfigNames = [
  ConfigNames.COMMISSIONING_DISTRO_SERIES,
  ConfigNames.DEFAULT_MIN_HWE_KERNEL,
] as PublicConfigName[];

export const commissioningConfigsOptions = {
  query: { name: commissioningConfigNames },
};

export type CommissioningFormValues = {
  commissioning_distro_series: string;
  default_min_hwe_kernel: string;
};

type CommissioningConfigs = Partial<CommissioningFormValues>;

const CommissioningForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);
  const commissioningDistroSeries = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const defaultMinKernelVersion = useSelector(
    configSelectors.defaultMinKernelVersion
  );
  const { allowed: canEdit } = useHasEntitlements([
    Entitlement.CAN_EDIT_CONFIGURATIONS,
  ]);

  return (
    <FormikForm<CommissioningFormValues>
      aria-label={Labels.FormLabel}
      cleanup={configActions.cleanup}
      editable={canEdit}
      enableReinitialize
      errors={errors}
      initialValues={{
        commissioning_distro_series: commissioningDistroSeries || "",
        default_min_hwe_kernel: defaultMinKernelVersion || "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Commissioning form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(configActions.update(values));
        resetForm({ values });
      }}
      saved={saved}
      saving={saving}
      validationSchema={CommissioningSchema}
    >
      <Fields canEdit={canEdit} />
    </FormikForm>
  );
};

export default CommissioningForm;
