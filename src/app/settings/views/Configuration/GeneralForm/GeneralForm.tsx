import { useEffect, useRef } from "react";

import { Col, Link, Row } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import ThemedRadioButton from "app/base/components/ThemedRadioButton";
import { useSendAnalytics } from "app/base/hooks";
import type { UsabillaLive } from "app/base/types";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

declare global {
  interface Window {
    usabilla_live: UsabillaLive;
  }
}

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  maas_theme_colour: Yup.string(),
  enable_analytics: Yup.boolean(),
  release_notifications: Yup.boolean(),
});

type GeneralFormValues = {
  maas_name: string;
  maas_theme_colour: string;
  enable_analytics: boolean;
  release_notifications: boolean;
};

const GeneralForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const maasName = useSelector(configSelectors.maasName);
  const maasTheme = useSelector(configSelectors.theme);
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
    <FormikForm<GeneralFormValues>
      buttonsAlign="left"
      buttonsBordered={false}
      initialValues={{
        maas_name: maasName || "",
        maas_theme_colour: maasTheme || "",
        enable_analytics: analyticsEnabled || false,
        release_notifications: releaseNotifications || false,
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
      saved={saved}
      saving={saving}
      validationSchema={GeneralSchema}
    >
      <FormikField
        help={
          <>
            Use MAAS name and unicode emoji(s) to describe your MAAS instance.{" "}
            <br />
            <br />
            Examples: <br />⛔ maas-prod <br />
            my-maas ⚠️ no-deploys
          </>
        }
        label="MAAS name"
        name="maas_name"
        required={true}
        type="text"
        wrapperClassName="u-sv2"
      />
      <p>MAAS theme main colour</p>
      {/* <p>{maasTheme}</p> */}
      <Row>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="default"
            component={ThemedRadioButton}
            label="Default"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="bark"
            component={ThemedRadioButton}
            label="Bark"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="sage"
            component={ThemedRadioButton}
            label="Sage"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="olive"
            component={ThemedRadioButton}
            label="Olive"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="viridian"
            component={ThemedRadioButton}
            label="Viridian"
            name="maas_theme_colour"
          />
        </Col>
      </Row>
      <Row>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="prussian-green"
            component={ThemedRadioButton}
            label="Prussian green"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="blue"
            component={ThemedRadioButton}
            label="Blue"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="purple"
            component={ThemedRadioButton}
            label="Purple"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="magenta"
            component={ThemedRadioButton}
            label="Magenta"
            name="maas_theme_colour"
          />
        </Col>
        <Col medium={1} size={1} small={2}>
          <FormikField
            colour="red"
            component={ThemedRadioButton}
            label="Red"
            name="maas_theme_colour"
          />
        </Col>
      </Row>

      <h5>Data analytics</h5>
      <FormikField
        help={
          <>
            The analytics used in MAAS are Google Analytics, Usabilla and Sentry
            Error Tracking.{" "}
            <Link
              href="https://ubuntu.com/legal/data-privacy"
              rel="noreferrer noopener"
              target="_blank"
            >
              Data privacy
            </Link>
          </>
        }
        label="Enable analytics to shape improvements to user experience"
        name="enable_analytics"
        type="checkbox"
        wrapperClassName="u-sv3"
      />
      <h5>Notifications</h5>
      <FormikField
        help="This applies to all users of MAAS. "
        label="Enable new release notifications"
        name="release_notifications"
        type="checkbox"
        wrapperClassName="u-sv3"
      />
    </FormikForm>
  );
};

export default GeneralForm;
