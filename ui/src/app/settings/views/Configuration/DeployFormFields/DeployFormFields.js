import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import selectors from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const DeployFormFields = ({ formikProps }) => {
  const defaultOSystemOptions = useSelector(
    selectors.config.defaultOSystemOptions
  );

  const distroSeriesOptions = useSelector(state =>
    selectors.general.getOsReleases(state, formikProps.values.default_osystem)
  );

  const allDistroSeries = useSelector(selectors.general.getAllOsReleases);

  return (
    <>
      <FormikField
        label="Default operating system used for deployment"
        component={Select}
        options={defaultOSystemOptions}
        fieldKey="default_osystem"
        formikProps={formikProps}
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
        fieldKey="default_distro_series"
        formikProps={formikProps}
      />
    </>
  );
};

DeployFormFields.propTypes = extendFormikShape({
  default_distro_series: PropTypes.string,
  default_osystem: PropTypes.string
});

export default DeployFormFields;
