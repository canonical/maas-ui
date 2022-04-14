import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean(),
});

const ThirdPartyDriversForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const thirdPartyDriversEnabled = useSelector(
    configSelectors.thirdPartyDriversEnabled
  );

  return (
    <Formik
      initialValues={{
        enable_third_party_drivers: thirdPartyDriversEnabled,
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      validationSchema={ThirdPartyDriversSchema}
    >
      <FormikFormContent
        buttonsAlign="left"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Saved",
          category: "Images settings",
          label: "Ubuntu form",
        }}
        saving={saving}
        saved={saved}
      >
        <FormikField
          label="Enable the installation of proprietary drivers (i.e. HPVSA)"
          type="checkbox"
          name="enable_third_party_drivers"
        />
      </FormikFormContent>
    </Formik>
  );
};

export default ThirdPartyDriversForm;
