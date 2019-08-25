import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import selectors from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const CommissioningFormFields = ({ formikProps }) => {
  const distroSeriesOptions = useSelector(selectors.config.distroSeriesOptions);

  const ubuntuKernelOptions = useSelector(state =>
    selectors.general.getUbuntuKernelOptions(
      state,
      formikProps.values.commissioning_distro_series
    )
  );

  const allUbuntuKernelOptions = useSelector(
    selectors.general.getAllUbuntuKernelOptions
  );

  return (
    <>
      <FormikField
        label="Default Ubuntu release used for commissioning"
        component={Select}
        options={distroSeriesOptions}
        fieldKey="commissioning_distro_series"
        formikProps={formikProps}
        onChange={e => {
          formikProps.handleChange(e);
          formikProps.setFieldTouched(
            "commissioning_distro_series",
            true,
            true
          );
          formikProps.setFieldValue(
            "default_min_hwe_kernel",
            allUbuntuKernelOptions[e.target.value][0].value
          );
          formikProps.setFieldTouched("default_min_hwe_kernel", true, true);
        }}
      />
      <FormikField
        label="Default minimum kernel version"
        component={Select}
        options={ubuntuKernelOptions}
        help="The default minimum kernel version used on all new and commissioned nodes"
        fieldKey="default_min_hwe_kernel"
        formikProps={formikProps}
      />
    </>
  );
};

CommissioningFormFields.propTypes = extendFormikShape({
  commissioning_distro_series: PropTypes.string,
  default_min_hwe_kernel: PropTypes.string
});

export default CommissioningFormFields;
