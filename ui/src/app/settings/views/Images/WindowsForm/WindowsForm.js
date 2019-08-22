import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import WindowsFormFields from "../WindowsFormFields";

const WindowsSchema = Yup.object().shape({
  windows_kms_host: Yup.string()
});

const WindowsForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const windowsKmsHost = useSelector(config.windowsKmsHost);

  return (
    <Formik
      initialValues={{
        windows_kms_host: windowsKmsHost
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={WindowsSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <WindowsFormFields formikProps={formikProps} />
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

export default WindowsForm;
