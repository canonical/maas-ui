import { ActionButton, Form } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import DeployFormFields from "app/settings/views/Configuration/DeployFormFields";

const DeploySchema = Yup.object().shape({
  default_osystem: Yup.string(),
  commissioning_distro_series: Yup.string()
});

const DeployForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const defaultOSystem = useSelector(configSelectors.defaultOSystem);
  const defaultDistroSeries = useSelector(configSelectors.defaultDistroSeries);

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
