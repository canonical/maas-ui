import { Form, Notification, Select } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { licensekeys as licenseKeysSelectors } from "app/base/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useFormikErrors } from "app/base/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";

export const LicenseKeyFormFields = ({
  editing = false,
  osystems,
  releases,
  formikProps
}) => {
  const saving = useSelector(licenseKeysSelectors.saving);
  const saved = useSelector(licenseKeysSelectors.saved);
  const errors = useSelector(licenseKeysSelectors.errors);

  useFormikErrors(errors, formikProps);

  let licenseKeyErrors;
  if (errors) {
    if (typeof errors === "string") {
      licenseKeyErrors = errors;
    } else if ("__all__" in errors) {
      licenseKeyErrors = errors["__all__"].join(" ");
    }
  }

  const distroSeriesOptions = releases[formikProps.values.osystem];

  return (
    <>
      {licenseKeyErrors && (
        <Notification type="negative" status="Error:">
          {licenseKeyErrors}
        </Notification>
      )}
      <Form onSubmit={formikProps.handleSubmit}>
        <>
          <FormikField
            component={Select}
            name="osystem"
            label="Operating System"
            required={true}
            options={osystems.map(osystem => {
              const [os, label] = osystem;
              return { value: os, label };
            })}
            onChange={e => {
              formikProps.handleChange(e);
              formikProps.setFieldTouched("distro_series", true, true);
              formikProps.setFieldValue(
                "distro_series",
                releases[e.target.value][0]
              );
            }}
          />
          <FormikField
            component={Select}
            name="distro_series"
            label="Release"
            required={true}
            options={distroSeriesOptions}
            onChange={e => {
              formikProps.handleChange(e);
              formikProps.setFieldTouched("osystem", true, true);
            }}
          />
          <FormikField
            name="license_key"
            label="License key"
            type="text"
            required={true}
          />
        </>
        <FormCardButtons
          actionDisabled={saving || formikFormDisabled(formikProps)}
          actionLabel={editing ? "Update license key" : "Add license key"}
          actionLoading={saving}
          actionSuccess={saved}
        />
      </Form>
    </>
  );
};

LicenseKeyFormFields.propTypes = {
  editing: PropTypes.bool,
  osystems: PropTypes.array.isRequired,
  releases: PropTypes.object.isRequired,
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      osystem: PropTypes.bool,
      distro_series: PropTypes.bool,
      license_key: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.shape({
      osystem: PropTypes.bool,
      distro_series: PropTypes.bool,
      license_key: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      osystem: PropTypes.string,
      distro_series: PropTypes.string,
      license_key: PropTypes.string
    }).isRequired
  })
};
export default LicenseKeyFormFields;
