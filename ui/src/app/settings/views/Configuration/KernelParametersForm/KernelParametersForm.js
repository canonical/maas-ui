import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const KernelParametersSchema = Yup.object().shape({
  kernel_opts: Yup.string()
});

const KernelParametersForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const kernelParams = useSelector(configSelectors.kernelParams);

  return (
    <FormikForm
      initialValues={{
        kernel_opts: kernelParams
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Kernel parameters form"
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={KernelParametersSchema}
    >
      <FormikField
        label="Boot parameters to pass to the kernel by default"
        type="text"
        name="kernel_opts"
      />
    </FormikForm>
  );
};

export default KernelParametersForm;
