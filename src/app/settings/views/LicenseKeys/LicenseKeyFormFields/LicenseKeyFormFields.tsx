import type { ChangeEvent } from "react";

import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { LicenseKeyFormValues } from "../LicenseKeyForm/types";

import FormikField from "app/base/components/FormikField";
import type { OSInfoOptions } from "app/store/general/selectors/osInfo";

type Props = {
  osystems: string[][];
  releases: OSInfoOptions;
};

export enum Labels {
  OperatingSystem = "Operating System",
  Release = "Release",
  LicenseKey = "License key",
}

export const LicenseKeyFormFields = ({
  osystems,
  releases,
}: Props): JSX.Element => {
  const formikProps = useFormikContext<LicenseKeyFormValues>();
  const distroSeriesOptions = releases[formikProps.values.osystem];

  return (
    <>
      <FormikField
        component={Select}
        label={Labels.OperatingSystem}
        name="osystem"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          formikProps.handleChange(e);
          formikProps.setFieldTouched("distro_series", true, true);
          formikProps.setFieldValue(
            "distro_series",
            releases[e.target.value][0]
          );
        }}
        options={osystems.map((osystem) => {
          const [os, label] = osystem;
          return { value: os, label };
        })}
        required={true}
      />
      <FormikField
        component={Select}
        label={Labels.Release}
        name="distro_series"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          formikProps.handleChange(e);
          formikProps.setFieldTouched("osystem", true, true);
        }}
        options={distroSeriesOptions}
        required={true}
      />
      <FormikField
        label={Labels.LicenseKey}
        name="license_key"
        required={true}
        type="text"
      />
    </>
  );
};

export default LicenseKeyFormFields;
