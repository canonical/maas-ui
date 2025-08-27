import { ContentSection } from "@canonical/maas-react-components";
import { Icon, Notification, Spinner } from "@canonical/react-components";
import { formatDuration } from "date-fns";
import * as Yup from "yup";

import {
  useConfigurations,
  useBulkSetConfigurations,
} from "@/app/api/query/configurations";
import type { PublicConfigName, SetConfigurationsError } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useLogout } from "@/app/base/hooks/logout";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import {
  humanReadableToSeconds,
  secondsToDuration,
} from "@/app/utils/timeSpan";

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
      /^((\d)+ ?(hour|day|week|minute)(s)? ?(and)? ?)+$/,
      "Unit must be `string` type with a value of weeks, days, hours, and/or minutes."
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

        return sessionLengthInSeconds <= 1209600;
      }
    ),
});

const SessionTimeout = (): React.ReactElement => {
  const names = [ConfigNames.SESSION_LENGTH] as PublicConfigName[];
  const { data, isPending, error } = useConfigurations({
    query: { name: names },
  });
  const session_length = data?.items?.[0].value || {};
  const updateConfig = useBulkSetConfigurations();
  useWindowTitle("Session timeout");
  const logout = useLogout();

  if (isPending) {
    return <Spinner aria-label={Labels.Loading} text={Labels.Loading} />;
  }

  return (
    <PageContent sidePanelContent={null} sidePanelTitle={null}>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Session timeout
        </ContentSection.Title>
        <ContentSection.Content>
          {error && (
            <Notification
              severity="negative"
              title="Error while fetching setting security configurations session timeout"
            >
              {error.message}
            </Notification>
          )}
          <FormikForm<SessionTimeoutFormValues, SetConfigurationsError>
            aria-label={Labels.ConfigureSessionTimeout}
            cleanup={configActions.cleanup}
            errors={updateConfig.error}
            initialValues={{
              session_length: formatDuration(
                secondsToDuration(session_length as number)
              ),
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Security settings",
              label: "Session timeout form",
            }}
            onSubmit={(values, { resetForm }) => {
              const sessionLengthInSeconds = humanReadableToSeconds(
                values.session_length
              );
              sessionLengthInSeconds &&
                updateConfig.mutate(
                  {
                    body: {
                      configurations: [
                        {
                          name: ConfigNames.SESSION_LENGTH,
                          value: sessionLengthInSeconds,
                        },
                      ],
                    },
                  },
                  {
                    onSuccess: logout,
                  }
                );

              resetForm({ values });
            }}
            resetOnSave
            saved={updateConfig.isSuccess}
            saving={updateConfig.isPending}
            validationSchema={SessionTimeoutSchema}
          >
            <FormikField
              help={
                <span>
                  Maximum session length is 14 days / 2 weeks. Format options
                  are weeks, days, hours, and/or minutes.
                  <br />
                  <br />
                  <Icon name="warning" /> MAAS will automatically log out all
                  users after changing the session expiration time. New session
                  timeout applies after login.
                </span>
              }
              label={Labels.Expiration}
              name="session_length"
              required={true}
              type="text"
            />
          </FormikForm>
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default SessionTimeout;
