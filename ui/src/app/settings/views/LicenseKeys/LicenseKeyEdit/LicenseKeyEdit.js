import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { useParams } from "app/base/hooks";
import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";

import LicenseKeyForm from "../LicenseKeyForm";

export const LicenseKeyEdit = () => {
  const dispatch = useDispatch();
  const { osystem, distro_series } = useParams();
  const loading = useSelector(licenseKeysSelectors.loading);

  const licenseKey = useSelector(state =>
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
    return <Loader text="Loading..." />;
  }
  if (!licenseKey) {
    return <h4>License key not found</h4>;
  }
  return <LicenseKeyForm licenseKey={licenseKey} />;
};

export default LicenseKeyEdit;
