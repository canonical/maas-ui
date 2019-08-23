import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import ThirdPartyDriversFormFields from "../ThirdPartyDriversFormFields";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean()
});

const ThirdPartyDriversForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const thirdPartyDriversEnabled = useSelector(config.thirdPartyDriversEnabled);

  return (
    <Formik
      initialValues={{
        enable_third_party_drivers: thirdPartyDriversEnabled
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={ThirdPartyDriversSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <ThirdPartyDriversFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={saving || formikFormDisabled(formikProps)}
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

export default ThirdPartyDriversForm;
