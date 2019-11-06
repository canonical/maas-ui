import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

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
    <FormikForm
      initialValues={{
        windows_kms_host: windowsKmsHost
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={WindowsSchema}
    >
      <FormikField
        label="Windows KMS activation host"
        type="text"
        name="windows_kms_host"
        help="FQDN or IP address of the host that provides the KMS Windows activation service. (Only needed for Windows deployments using KMS activation.)"
      />
    </FormikForm>
  );
};

export default WindowsForm;
