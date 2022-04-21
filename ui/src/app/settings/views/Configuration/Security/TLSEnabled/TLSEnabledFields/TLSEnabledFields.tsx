import { Slider } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { TLSEnabledValues } from "../TLSEnabled";
import { Labels } from "../TLSEnabled";

import FormikField from "app/base/components/FormikField";
import { TLSExpiryNotificationInterval } from "app/store/config/types";

const TLSEnabledFields = (): JSX.Element => {
  const { setFieldValue, values } = useFormikContext<TLSEnabledValues>();

  return (
    <>
      <FormikField
        label={Labels.NotificationCheckbox}
        name="notificationEnabled"
        type="checkbox"
      />
      <div className="p-slider--inline">
        <FormikField<typeof Slider>
          component={Slider}
          disabled={values.notificationEnabled === false}
          help={
            <>
              <span>{TLSExpiryNotificationInterval.MIN}</span>
              <span>{TLSExpiryNotificationInterval.MAX}</span>
            </>
          }
          label={Labels.Interval}
          max={TLSExpiryNotificationInterval.MAX}
          min={TLSExpiryNotificationInterval.MIN}
          name="notificationInterval"
          onChange={(e) =>
            setFieldValue("notificationInterval", Number(e.currentTarget.value))
          }
          showInput
          step={1}
          value={values.notificationInterval}
        />
      </div>
      <p>
        {/*
          TODO: Add docs links
          https://github.com/canonical-web-and-design/app-tribe/issues/829
        */}
        <a href="#todo">How to set up auto-renew for certificates</a>
      </p>
    </>
  );
};

export default TLSEnabledFields;
