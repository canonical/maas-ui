import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import GeneralFormFields from "app/settings/containers/Configuration/GeneralFormFields";

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean()
});

const GeneralForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const maasName = useSelector(config.maasName);
  const analyticsEnabled = useSelector(config.analyticsEnabled);

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
      validationSchema={GeneralSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <GeneralFormFields formikProps={formikProps} />
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

export default GeneralForm;
