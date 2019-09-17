import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import CommissioningFormFields from "../CommissioningFormFields";

const CommissioningSchema = Yup.object().shape({
  commissioning_distro_series: Yup.string(),
  default_min_hwe_kernel: Yup.string()
});

const CommissioningForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const commissioningDistroSeries = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const defaultMinKernelVersion = useSelector(
    configSelectors.defaultMinKernelVersion
  );

  return (
    <Formik
      initialValues={{
        commissioning_distro_series: commissioningDistroSeries,
        default_min_hwe_kernel: defaultMinKernelVersion
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={CommissioningSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <CommissioningFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={formikFormDisabled(formikProps)}
            loading={saving}
            success={saved}
          >
            Save
          </ActionButton>
        </Form>
      )}
    />
  );
};

export default CommissioningForm;
