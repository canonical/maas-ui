import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import DeployFormFields from "app/settings/views/Configuration/DeployFormFields";

const DeploySchema = Yup.object().shape({
  default_osystem: Yup.string(),
  commissioning_distro_series: Yup.string()
});

const DeployForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const defaultOSystem = useSelector(config.defaultOSystem);
  const defaultDistroSeries = useSelector(config.defaultDistroSeries);

  return (
    <Formik
      initialValues={{
        default_osystem: defaultOSystem,
        default_distro_series: defaultDistroSeries
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={DeploySchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <DeployFormFields formikProps={formikProps} />
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

export default DeployForm;
