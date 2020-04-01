import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import CommissioningFormFields from "../CommissioningFormFields";
import FormikForm from "app/base/components/FormikForm";

const CommissioningSchema = Yup.object().shape({
  commissioning_distro_series: Yup.string(),
  default_min_hwe_kernel: Yup.string(),
});

const CommissioningForm = () => {
  const dispatch = useDispatch();
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const commissioningDistroSeries = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const defaultMinKernelVersion = useSelector(
    configSelectors.defaultMinKernelVersion
  );

  return (
    <FormikForm
      initialValues={{
        commissioning_distro_series: commissioningDistroSeries,
        default_min_hwe_kernel: defaultMinKernelVersion,
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
      <CommissioningFormFields />
    </FormikForm>
  );
};

export default CommissioningForm;
