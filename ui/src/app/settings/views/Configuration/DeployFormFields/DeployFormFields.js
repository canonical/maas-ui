import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import { config as configSelectors } from "app/settings/selectors";
import { general as generalSelectors } from "app/base/selectors";
import FormikField from "app/base/components/FormikField";

const DeployFormFields = ({ formikProps }) => {
  const defaultOSystemOptions = useSelector(
    configSelectors.defaultOSystemOptions
  );

  const distroSeriesOptions = useSelector(state =>
    generalSelectors.osInfo.getOsReleases(
      state,
      formikProps.values.default_osystem
    )
  );

  const allDistroSeries = useSelector(generalSelectors.osInfo.getAllOsReleases);

  return (
    <>
      <FormikField
        label="Default operating system used for deployment"
        component={Select}
        options={defaultOSystemOptions}
        name="default_osystem"
        onChange={e => {
          formikProps.handleChange(e);
          formikProps.setFieldTouched("default_osystem", true, true);
          formikProps.setFieldValue(
            "default_distro_series",
            allDistroSeries[e.target.value][0].value
          );
          formikProps.setFieldTouched("default_distro_series", true, true);
        }}
      />
      <FormikField
        label="Default OS release used for deployment"
        component={Select}
        options={distroSeriesOptions}
        name="default_distro_series"
      />
    </>
  );
};

DeployFormFields.propTypes = extendFormikShape({
  default_distro_series: PropTypes.string,
  default_osystem: PropTypes.string
});

export default DeployFormFields;
