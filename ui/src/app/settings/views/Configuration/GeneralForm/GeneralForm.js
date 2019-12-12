import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { sendAnalyticsEvent } from "analytics";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean()
});

const GeneralForm = () => {
  const dispatch = useDispatch();
  const maasName = useSelector(configSelectors.maasName);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  return (
    <FormikForm
      initialValues={{
        maas_name: maasName,
        enable_analytics: analyticsEnabled
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "General form"
      }}
      onSubmit={(values, { resetForm }) => {
        sendAnalyticsEvent(
          "General configuration settings",
          values.enable_analytics ? "Turned on" : "Turned off",
          "Enable Google Analytics"
        );
        dispatch(configActions.update(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={GeneralSchema}
    >
      <FormikField
        label="MAAS name"
        type="text"
        name="maas_name"
        required={true}
      />
      <FormikField
        label="Enable Google Analytics in MAAS UI to shape improvements in user experience"
        type="checkbox"
        name="enable_analytics"
      />
    </FormikForm>
  );
};

export default GeneralForm;
