import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";
import Fields from "../CommissioningFormFields";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import FormikForm from "@/app/base/components/FormikForm";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { hasPermissions } from "@/app/utils/permissions";

const CommissioningSchema = Yup.object().shape({
  commissioning_distro_series: Yup.string(),
  default_min_hwe_kernel: Yup.string(),
});

export enum Labels {
  FormLabel = "Commissioning Form",
}

export type CommissioningFormValues = {
  commissioning_distro_series: string;
  default_min_hwe_kernel: string;
};

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
  const userEntitlements = useGetUserEntitlements();
  const canEdit = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_EDIT_CONFIGURATIONS,
  ]);

  return (
    <FormikForm<CommissioningFormValues>
      aria-label={Labels.FormLabel}
      cleanup={configActions.cleanup}
      editable={canEdit}
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
