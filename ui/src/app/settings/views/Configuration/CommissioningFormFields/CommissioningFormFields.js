import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import config from "app/settings/selectors/config";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const CommissioningFormFields = ({ formikProps }) => {
  const distroSeriesOptions = useSelector(config.distroSeriesOptions);
  const minKernelVersionOptions = useSelector(config.minKernelVersionOptions);

  return (
    <>
      <FormikField
        label="Default Ubuntu release used for commissioning"
        component={Select}
        options={distroSeriesOptions}
        fieldKey="commissioning_distro_series"
        formikProps={formikProps}
      />
      <FormikField
        label="Default minimum kernel version"
        component={Select}
        options={minKernelVersionOptions}
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
