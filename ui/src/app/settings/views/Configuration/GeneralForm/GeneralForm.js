import { Link } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";
import { sendAnalyticsEvent } from "analytics";
import { usePrevious } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean(),
});

const GeneralForm = () => {
  const dispatch = useDispatch();
  const maasName = useSelector(configSelectors.maasName);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const previousEnableAnalytics = usePrevious(analyticsEnabled);

  useEffect(() => {
    if (analyticsEnabled !== previousEnableAnalytics) {
      // If the analytics setting has been changed, the only way to be
      // completely sure the events are cleared is to reload the window.
      // This needs to be done once the data has been been updated successfully,
      // hence doing the refresh in this useEffect.
      window.location.reload();
    }
  }, [analyticsEnabled, previousEnableAnalytics]);

  return (
    <FormikForm
      initialValues={{
        maas_name: maasName,
        enable_analytics: analyticsEnabled,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "General form",
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
        wrapperClassName="u-sv2"
      />
      <h5 className="u-sv1">Data analytics</h5>
      <FormikField
        label="Enable analytics to shape improvements to user experience"
        type="checkbox"
        name="enable_analytics"
        help={
          <>
            The analytics used in MAAS are Google Analytics and Sentry Error
            Tracking.{" "}
            <Link href="https://ubuntu.com/legal/data-privacy" external>
              Data privacy
            </Link>
          </>
        }
        wrapperClassName="u-sv3"
      />
    </FormikForm>
  );
};

export default GeneralForm;
