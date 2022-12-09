import { Spinner, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

type SessionTimeoutFormValues = {
  session_length: number;
  time_unit: "hours" | "days";
};

export enum Labels {
  Loading = "Loading...",
  Edit = "Edit",
  Expiration = "Session timeout expiration",
  Save = "Save",
  Cancel = "Cancel",
  TimeUnit = "Time unit",
  Days = "Day(s)",
  Hours = "Hour(s)",
  ConfigureSessionTimeout = "Configure Session Timeout",
}

const SessionTimeout = (): JSX.Element => {
  const dispatch = useDispatch();
  const configLoading = useSelector(configSelectors.loading);
  // const sessionLength = useSelector(configSelectors.sessionLength);
  const sessionLength = 14;
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const timeUnitOptions = [
    { label: Labels.Hours, value: "hours" },
    { label: Labels.Days, value: "days" },
  ];

  if (configLoading) {
    return <Spinner aria-label={Labels.Loading} />;
  }

  return (
    <>
      <FormikForm<SessionTimeoutFormValues>
        aria-label={Labels.ConfigureSessionTimeout}
        buttonsAlign="right"
        buttonsBordered
        cleanup={configActions.cleanup}
        initialValues={{
          session_length: sessionLength,
          time_unit: "days",
        }}
        onCancel={(values, { resetForm }) => {
          resetForm();
          values.session_length = 14;
          values.time_unit = "hours";
        }}
        onSubmit={(values) => {
          dispatch(configActions.cleanup());
          dispatch(
            configActions.update({
              session_length: Number(values.session_length),
            })
          );
        }}
        saved={saved}
        saving={saving}
      >
        <span className="p-form__group">
          <FormikField
            className="p-form__session-length-input"
            label={Labels.Expiration}
            name="session_length"
            required
            type="number"
            wrapperClassName="p-form__session-length-input"
          />
          <FormikField
            component={Select}
            label={Labels.TimeUnit}
            name="time_unit"
            options={timeUnitOptions}
            wrapperClassName="p-form__time-unit-input"
          />
        </span>
      </FormikForm>
    </>
  );
};

export default SessionTimeout;
