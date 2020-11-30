import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import Fields from "../CommissioningFormFields";

import FormikForm from "app/base/components/FormikForm";
import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";

const CommissioningSchema = Yup.object().shape({
  commissioning_distro_series: Yup.string(),
  default_min_hwe_kernel: Yup.string(),
  maas_auto_ipmi_user: Yup.string()
    .required(
      'The username cannot be left blank. The username is "maas" by default.'
    )
    .min(3, "The username must be 3 characters or more")
    .max(16, "The username must be 16 characters or less.")
    .matches(/^\S*$/, "The username may not contain spaces"),
  maas_auto_ipmi_k_g_bmc_key: Yup.string(),
  maas_auto_ipmi_user_privilege_level: Yup.string().matches(
    /(ADMIN|OPERATOR|USER)/
  ),
});

export type CommissioningFormValues = {
  commissioning_distro_series: string;
  default_min_hwe_kernel: string;
  maas_auto_ipmi_user: string;
  maas_auto_ipmi_k_g_bmc_key: string;
  maas_auto_ipmi_user_privilege_level: "ADMIN" | "OPERATOR" | "USER";
};

const CommissioningForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const commissioningDistroSeries = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const defaultMinKernelVersion = useSelector(
    configSelectors.defaultMinKernelVersion
  );
  const ipmiUser = useSelector(configSelectors.maasAutoIpmiUser);
  const bmcKey = useSelector(configSelectors.maasAutoIpmiKGBmcKey);
  const ipmiPrivilegeLevel = useSelector(
    configSelectors.maasAutoUserPrivilegeLevel
  );

  return (
    <FormikForm
      initialValues={{
        commissioning_distro_series: commissioningDistroSeries,
        default_min_hwe_kernel: defaultMinKernelVersion,
        maas_auto_ipmi_user: ipmiUser || "maas",
        maas_auto_ipmi_k_g_bmc_key: bmcKey || "",
        maas_auto_ipmi_user_privilege_level: ipmiPrivilegeLevel,
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
      saving={saving}
      saved={saved}
      validationSchema={CommissioningSchema}
    >
      <Fields />
    </FormikForm>
  );
};

export default CommissioningForm;
