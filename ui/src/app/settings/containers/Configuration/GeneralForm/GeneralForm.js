import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import { useSettingsSave } from "app/base/hooks";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import GeneralFormFields from "app/settings/containers/Configuration/GeneralFormFields";

const CommissioningSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean()
});

const GeneralForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const maasName = useSelector(config.maasName);
  const analyticsEnabled = useSelector(config.analyticsEnabled);

  const saving = useSelector(config.saving);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  useSettingsSave(saving, setLoading, setSuccess);

  return (
    <Formik
      initialValues={{
        maas_name: maasName,
        enable_analytics: analyticsEnabled
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={CommissioningSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <GeneralFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={formikFormDisabled(formikProps)}
            loading={loading}
            success={success}
            width="60px"
          >
            Save
          </ActionButton>
        </Form>
      )}
    />
  );
};

export default GeneralForm;
