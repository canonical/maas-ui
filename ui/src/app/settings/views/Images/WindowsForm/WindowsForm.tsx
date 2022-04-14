import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const WindowsSchema = Yup.object().shape({
  windows_kms_host: Yup.string(),
});

const WindowsForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const windowsKmsHost = useSelector(configSelectors.windowsKmsHost);

  return (
    <Formik
      initialValues={{
        windows_kms_host: windowsKmsHost,
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      validationSchema={WindowsSchema}
    >
      <FormikFormContent
        buttonsAlign="left"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Saved",
          category: "Images settings",
          label: "Windows form",
        }}
        saving={saving}
        saved={saved}
      >
        <FormikField
          label="Windows KMS activation host"
          type="text"
          name="windows_kms_host"
          help="FQDN or IP address of the host that provides the KMS Windows activation service. (Only needed for Windows deployments using KMS activation.)"
        />
      </FormikFormContent>
    </Formik>
  );
};

export default WindowsForm;
