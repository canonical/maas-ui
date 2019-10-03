import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import SearchBox from "app/base/components/SearchBox";

import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";

const generateRows = licenseKeys =>
  licenseKeys.map(licenseKey => {
    return {
      className: "p-table__row",
      columns: [
        {
          content: licenseKey.osystem,
          role: "rowheader"
        },
        {
          content: licenseKey.distro_series
        },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/settings/license-keys/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Button
                appearance="base"
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--delete">Delete</i>
              </Button>
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      key: licenseKey.license_key,
      sortData: {
        osystem: licenseKey.osystem,
        title: licenseKey.title
      }
    };
  });

const LicenseKeyList = () => {
  const [searchText, setSearchText] = useState("");
  const licenseKeys = useSelector(state =>
    licenseKeysSelectors.search(state, searchText)
  );
  const licenseKeysLoading = useSelector(licenseKeysSelectors.loading);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(licenseKeysActions.fetch());
  }, [dispatch]);

  return (
    <>
      {licenseKeysLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to={`/settings/license-keys/add`}>
          Add license key
        </Button>
      </div>

      {licenseKeysLoaded && (
        <MainTable
          className="p-table-expanding--light"
          expanding={true}
          headers={[
            {
              content: "Operating System",
              sortKey: "osystem"
            },
            {
              content: "Distro Series",
              sortKey: "distro_series"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          paginate={20}
          rows={generateRows(licenseKeys)}
          sortable={true}
        />
      )}
    </>
  );
};

export default LicenseKeyList;
