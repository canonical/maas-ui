import type { ChangeEvent } from "react";

import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { DeployFormValues } from "../DeployForm/types";

import FormikField from "app/base/components/FormikField";
import configSelectors from "app/store/config/selectors";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";

const DeployFormFields = (): JSX.Element => {
  const formikProps = useFormikContext<DeployFormValues>();
  const defaultOSystemOptions = useSelector(
    configSelectors.defaultOSystemOptions
  );

  const distroSeriesOptions = useSelector((state: RootState) =>
    osInfoSelectors.getOsReleases(state, formikProps.values.default_osystem)
  );

  const allDistroSeries = useSelector(osInfoSelectors.getAllOsReleases);

  return (
    <>
      <FormikField
        label="Default operating system used for deployment"
        component={Select}
        options={defaultOSystemOptions}
        name="default_osystem"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
      <FormikField
        label="Default hardware sync interval (hours)"
        name="hardware_sync_interval"
        type="text"
      />
    </>
  );
};

export default DeployFormFields;
