import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import LicenseKeyForm from "../LicenseKeyForm";

import { actions as licenseKeysActions } from "app/store/licensekeys";
import licenseKeysSelectors from "app/store/licensekeys/selectors";
import type { LicenseKeys } from "app/store/licensekeys/types";
import type { RootState } from "app/store/root/types";

export const LicenseKeyEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  const { osystem, distro_series } = useParams<{
    osystem: LicenseKeys["osystem"];
    distro_series: LicenseKeys["distro_series"];
  }>();
  const loading = useSelector(licenseKeysSelectors.loading);

  const licenseKey = useSelector((state: RootState) =>
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
