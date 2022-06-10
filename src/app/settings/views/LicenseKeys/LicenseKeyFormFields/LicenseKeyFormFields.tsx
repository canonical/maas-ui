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
        name="osystem"
        label="Operating System"
        required={true}
        options={osystems.map((osystem) => {
          const [os, label] = osystem;
          return { value: os, label };
        })}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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

export default LicenseKeyFormFields;
