import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean()
});

const ThirdPartyDriversForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const thirdPartyDriversEnabled = useSelector(
    configSelectors.thirdPartyDriversEnabled
  );

  return (
    <FormikForm
      initialValues={{
        enable_third_party_drivers: thirdPartyDriversEnabled
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "Ubuntu form"
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={ThirdPartyDriversSchema}
    >
      <FormikField
        label="Enable the installation of proprietary drivers (i.e. HPVSA)"
        type="checkbox"
        name="enable_third_party_drivers"
      />
    </FormikForm>
  );
};

export default ThirdPartyDriversForm;
