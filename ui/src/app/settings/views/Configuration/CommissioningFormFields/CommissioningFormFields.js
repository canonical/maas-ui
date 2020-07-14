import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useFormikContext } from "formik";
import React from "react";

import configSelectors from "app/store/config/selectors";
import FormikField from "app/base/components/FormikField";
import generalSelectors from "app/store/general/selectors";

const CommissioningFormFields = () => {
  const formikProps = useFormikContext();
  const distroSeriesOptions = useSelector(configSelectors.distroSeriesOptions);

  const ubuntuKernelOptions = useSelector((state) =>
    generalSelectors.osInfo.getUbuntuKernelOptions(
      state,
      formikProps.values.commissioning_distro_series
    )
  );

  const allUbuntuKernelOptions = useSelector(
    generalSelectors.osInfo.getAllUbuntuKernelOptions
  );

  return (
    <>
      <FormikField
        label="Default Ubuntu release used for commissioning"
        component={Select}
        options={distroSeriesOptions}
        name="commissioning_distro_series"
        onChange={(e) => {
          const kernelValue =
            allUbuntuKernelOptions[e.target.value] &&
            allUbuntuKernelOptions[e.target.value][0].value;

          formikProps.handleChange(e);
          formikProps.setFieldTouched(
            "commissioning_distro_series",
            true,
            true
          );
          formikProps.setFieldValue("default_min_hwe_kernel", kernelValue);
          formikProps.setFieldTouched("default_min_hwe_kernel", true, true);
        }}
      />
      <FormikField
        label="Default minimum kernel version"
        component={Select}
        options={ubuntuKernelOptions}
        help="The default minimum kernel version used on all new and commissioned nodes"
        name="default_min_hwe_kernel"
      />
    </>
  );
};

export default CommissioningFormFields;
