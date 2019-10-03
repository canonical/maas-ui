import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";

const LicenseKeyList = () => {
  const dispatch = useDispatch();
  const licenseKeys = useSelector(licenseKeysSelectors.all);

  useEffect(() => {
    dispatch(licenseKeysActions.fetch());
  }, [dispatch]);

  return (
    <>
      <h4>License keys</h4>
      <ul>
        {licenseKeys.map(key => (
          <li key={key.license_key}>
            {key.osystem} | {key.license_key}
          </li>
        ))}
      </ul>
    </>
  );
};

export default LicenseKeyList;
