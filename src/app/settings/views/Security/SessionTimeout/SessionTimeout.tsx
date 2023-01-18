import { Spinner } from "@canonical/react-components";
import { formatDuration } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { humanReadableToSeconds, secondsToDuration } from "app/utils/timeSpan";

type SessionTimeoutFormValues = {
  session_length: string;
};

export enum Labels {
  Loading = "Loading...",
  Expiration = "Session timeout expiration",
  Save = "Save",
  ConfigureSessionTimeout = "Configure Session Timeout",
}

const SessionTimeoutSchema = Yup.object().shape({
  session_length: Yup.string()
    .required("Timeout length is required")
    .matches(
      /^((\d)+ ?(hour|day|week)(s)? ?(and)? ?)+$/,
      "Unit must be `string` type with a value of weeks, days, and/or hours."
    )
    .test(
      "session-length-boundary-check",
      "Maximum value is 2 weeks (or equivalent)",
      function (value) {
        if (!value) {
          return false;
        }

        const sessionLengthInSeconds = humanReadableToSeconds(value);
        if (!sessionLengthInSeconds) {
          return false;
        }

        if (sessionLengthInSeconds <= 1209600) {
          return true;
        } else {
          return false;
        }
      }
    ),
});

const SessionTimeout = (): JSX.Element => {
  useWindowTitle("Session timeout");
  const dispatch = useDispatch();
  const configLoading = useSelector(configSelectors.loading);
  const sessionLength = useSelector(configSelectors.sessionLength) || undefined;
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  if (configLoading) {
    return <Spinner aria-label={Labels.Loading} text={Labels.Loading} />;
  }

  return (
    <>
      <FormikForm<SessionTimeoutFormValues>
        aria-label={Labels.ConfigureSessionTimeout}
        buttonsAlign="left"
        buttonsBordered={false}
        cleanup={configActions.cleanup}
        initialValues={{
          session_length: formatDuration(secondsToDuration(sessionLength)),
        }}
        onSaveAnalytics={{
          action: "Saved",
          category: "Security settings",
          label: "Session timeout form",
        }}
        onSubmit={(values) => {
          const sessionLengthInSeconds = humanReadableToSeconds(
            values.session_length
          );
          sessionLengthInSeconds &&
            dispatch(
              configActions.update({
                session_length: sessionLengthInSeconds,
              })
            );
          dispatch(configActions.cleanup());
        }}
        resetOnSave
        saved={saved}
        saving={saving}
        validationSchema={SessionTimeoutSchema}
      >
        <FormikField
          help="Maximum session length is 14 days / 2 weeks. Format options are weeks, days, hours."
          label={Labels.Expiration}
          name="session_length"
          required={true}
          type="text"
        />
      </FormikForm>
    </>
  );
};

export default SessionTimeout;
