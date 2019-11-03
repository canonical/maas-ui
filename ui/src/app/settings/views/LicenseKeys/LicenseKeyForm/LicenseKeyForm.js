import { Formik } from "formik";
import { Loader } from "@canonical/react-components";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";

import { general as generalActions } from "app/base/actions";
import { general as generalSelectors } from "app/base/selectors";
import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import LicenseKeyFormFields from "../LicenseKeyFormFields";
import FormCard from "app/base/components/FormCard";

const LicenseKeySchema = Yup.object().shape({
  osystem: Yup.string().required("Operating system is required"),
  distro_series: Yup.string().required("Release is required"),
  license_key: Yup.string().required("A license key is required")
});

export const LicenseKeyForm = ({ licenseKey }) => {
  const [savingLicenseKey, setSaving] = useState();
  const saved = useSelector(licenseKeysSelectors.saved);
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const dispatch = useDispatch();
  const releases = useSelector(generalSelectors.osInfo.getLicensedOsReleases);
  const osystems = useSelector(generalSelectors.osInfo.getLicensedOsystems);
  const isLoaded = licenseKeysLoaded && osInfoLoaded;

  const title = licenseKey ? "Update license key" : "Add license key";

  useWindowTitle(title);

  const editing = !!licenseKey;

  useAddMessage(
    saved,
    licenseKeysActions.cleanup,
    `${savingLicenseKey} ${editing ? "updated" : "added"} successfully.`,
    setSaving
  );

  useEffect(() => {
    if (!osInfoLoaded) {
      dispatch(generalActions.fetchOsInfo());
    }
    if (!licenseKeysLoaded) {
      dispatch(licenseKeysActions.fetch());
    }
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(licenseKeysActions.cleanup());
    };
  }, [dispatch, osInfoLoaded, licenseKeysLoaded]);

  if (saved) {
    // The license key was successfully created/updated so redirect to the license key list.
    return <Redirect to="/settings/license-keys" />;
  }

  return (
    <FormCard title={title}>
      {!isLoaded ? (
        <Loader text="loading..." />
      ) : osystems.length > 0 ? (
        <Formik
          initialValues={{
            osystem: licenseKey ? licenseKey.osystem : osystems[0][0],
            distro_series: licenseKey
              ? licenseKey.distro_series
              : releases[osystems[0][0]][0].value,
            license_key: licenseKey ? licenseKey.license_key : ""
          }}
          validationSchema={LicenseKeySchema}
          onSubmit={values => {
            const params = {
              osystem: values.osystem,
              distro_series: values.distro_series,
              license_key: values.license_key
            };
            if (editing) {
              dispatch(licenseKeysActions.update(params));
            } else {
              dispatch(licenseKeysActions.create(params));
            }
            setSaving(`${params.osystem} (${params.distro_series})`);
          }}
          render={formikProps => {
            return (
              <LicenseKeyFormFields
                editing={editing}
                osystems={osystems}
                releases={releases}
                formikProps={formikProps}
              />
            );
          }}
        />
      ) : (
        <span>No available licensed operating systems.</span>
      )}
    </FormCard>
  );
};

export default LicenseKeyForm;
