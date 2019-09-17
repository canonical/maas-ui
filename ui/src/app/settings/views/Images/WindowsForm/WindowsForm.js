import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import WindowsFormFields from "../WindowsFormFields";

const WindowsSchema = Yup.object().shape({
  windows_kms_host: Yup.string()
});

const WindowsForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const windowsKmsHost = useSelector(configSelectors.windowsKmsHost);

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

export default WindowsForm;
