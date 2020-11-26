import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";

import FormikField from "app/base/components/FormikField";

export const LicenseKeyFormFields = ({
  editing = false,
  osystems,
  releases,
}) => {
  const formikProps = useFormikContext();
  const distroSeriesOptions = releases[formikProps.values.osystem];

  return (
    <>
      <FormikField
        component={Select}
        name="osystem"
        label="Operating System"
        required={true}
        options={osystems.map((osystem) => {
          const [os, label] = osystem;
          return { value: os, label };
        })}
        onChange={(e) => {
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
        onChange={(e) => {
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
  );
};

LicenseKeyFormFields.propTypes = {
  editing: PropTypes.bool,
  osystems: PropTypes.array.isRequired,
  releases: PropTypes.object.isRequired,
};
export default LicenseKeyFormFields;
