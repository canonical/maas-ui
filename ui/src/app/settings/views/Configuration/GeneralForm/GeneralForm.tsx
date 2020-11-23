import { Link } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import type { UsabillaLive } from "@maas-ui/maas-ui-shared";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useSendAnalytics } from "app/base/hooks";
import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";

declare global {
  interface Window {
    usabilla_live: UsabillaLive;
  }
}

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean(),
  release_notifications: Yup.boolean(),
});

const GeneralForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const maasName = useSelector(configSelectors.maasName);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const releaseNotifications = useSelector(
    configSelectors.releaseNotifications
  );
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const previousReleaseNotifications = useRef(releaseNotifications);
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

  const sendAnalytics = useSendAnalytics();

  return (
    <FormikForm
      initialValues={{
        maas_name: maasName,
        enable_analytics: analyticsEnabled,
        release_notifications: releaseNotifications,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "General form",
      }}
      onSubmit={(values, { resetForm }) => {
        if (values.enable_analytics !== previousEnableAnalytics) {
          // Only send the analytics event if the value changes.
          sendAnalytics(
            "General configuration settings",
            values.enable_analytics ? "Turned on" : "Turned off",
            "Enable Google Analytics"
          );
        }
        // Show the Usabilla form if the notifications have been turned off and
        // analytics has been enabled and Usabilla as been instantiated.
        if (
          !values.release_notifications &&
          previousReleaseNotifications.current &&
          values.enable_analytics &&
          window.usabilla_live
        ) {
          window.usabilla_live("trigger", "release_notifications_off");
        }
        previousReleaseNotifications.current = values.release_notifications;
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
            The analytics used in MAAS are Google Analytics, Usabilla and Sentry
            Error Tracking.{" "}
            <Link href="https://ubuntu.com/legal/data-privacy" external>
              Data privacy
            </Link>
          </>
        }
        wrapperClassName="u-sv3"
      />
      <h5 className="u-sv1">Notifications</h5>
      <FormikField
        label="Enable new release notifications"
        type="checkbox"
        name="release_notifications"
        help="This applies to all users of MAAS. "
        wrapperClassName="u-sv3"
      />
    </FormikForm>
  );
};

export default GeneralForm;
