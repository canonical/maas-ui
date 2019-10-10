import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";

import { general as generalActions } from "app/base/actions";
import { general as generalSelectors } from "app/base/selectors";
import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import Loader from "app/base/components/Loader";
import LicenseKeyFormFields from "../LicenseKeyFormFields";
import FormCard from "app/base/components/FormCard";

const LicenseKeySchema = Yup.object().shape({
  osystem: Yup.string().required("Operating system is required"),
  distro_series: Yup.string().required("Release is required"),
  license_key: Yup.string().required("A license key is required")
});

export const LicenseKeyForm = () => {
  const [savingLicenseKey, setSaving] = useState();
  const saved = useSelector(licenseKeysSelectors.saved);
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const dispatch = useDispatch();
  const isLoaded = licenseKeysLoaded && osInfoLoaded;
  const releases = useSelector(generalSelectors.osInfo.getLicensedOsReleases);
  const osystems = useSelector(generalSelectors.osInfo.getLicensedOsystems);

  useAddMessage(
    saved,
    licenseKeysActions.cleanup,
    `${savingLicenseKey} added successfully.`,
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
    <FormCard title="Add license key">
      {!isLoaded ? (
        <Loader text="loading..." />
      ) : (
        <Formik
          initialValues={{
            osystem: osystems[0][0],
            distro_series: releases[osystems[0][0]][0].value,
            license_key: ""
          }}
          validationSchema={LicenseKeySchema}
          onSubmit={values => {
            const params = {
              osystem: values.osystem,
              distro_series: values.distro_series,
              license_key: values.license_key
            };
            dispatch(licenseKeysActions.create(params));
            setSaving(`${params.osystem} (${params.distro_series})`);
          }}
          render={formikProps => {
            return (
              <LicenseKeyFormFields
                osystems={osystems}
                releases={releases}
                formikProps={formikProps}
              />
            );
          }}
        />
      )}
    </FormCard>
  );
};

export default LicenseKeyForm;
