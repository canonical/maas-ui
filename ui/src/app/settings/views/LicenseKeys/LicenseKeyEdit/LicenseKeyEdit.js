import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";

import LicenseKeyForm from "../LicenseKeyForm";

export const LicenseKeyEdit = () => {
  const dispatch = useDispatch();
  const { osystem, distro_series } = useParams();
  const loading = useSelector(licenseKeysSelectors.loading);

  const licenseKey = useSelector((state) =>
    licenseKeysSelectors.getByOsystemAndDistroSeries(
      state,
      osystem,
      distro_series
    )
  );

  useEffect(() => {
    dispatch(licenseKeysActions.fetch());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!licenseKey) {
    return <h4>License key not found</h4>;
  }
  return <LicenseKeyForm licenseKey={licenseKey} />;
};

export default LicenseKeyEdit;
