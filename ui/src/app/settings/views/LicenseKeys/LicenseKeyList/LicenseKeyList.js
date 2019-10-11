import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import SearchBox from "app/base/components/SearchBox";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";

const generateRows = (
  licenseKeys,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch,
  setDeleting
) =>
  licenseKeys.map(licenseKey => {
    const expanded = expandedId === licenseKey.license_key;

    return {
      className: expanded ? "p-table__row is-active" : null,
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
                onClick={() => {
                  setExpandedId(licenseKey.license_key);
                }}
              >
                <i className="p-icon--delete">Delete</i>
              </Button>
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={`${licenseKey.osystem} (${licenseKey.distro_series})`}
          modelType="license key"
          onCancel={hideExpanded}
          onConfirm={() => {
            dispatch(licenseKeysActions.delete(licenseKey));
            setDeleting(licenseKey);
            hideExpanded();
          }}
        />
      ),
      key: licenseKey.license_key,
      sortData: {
        osystem: licenseKey.osystem,
        title: licenseKey.title
      }
    };
  });

const LicenseKeyList = () => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState();
  const [searchText, setSearchText] = useState("");
  const [deletingLicenseKey, setDeleting] = useState();

  const licenseKeysLoading = useSelector(licenseKeysSelectors.loading);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const hasErrors = useSelector(licenseKeysSelectors.hasErrors);
  const errors = useSelector(licenseKeysSelectors.errors);
  const saved = useSelector(licenseKeysSelectors.saved);

  const licenseKeys = useSelector(state =>
    licenseKeysSelectors.search(state, searchText)
  );

  const title = deletingLicenseKey
    ? `${deletingLicenseKey.osystem} (${deletingLicenseKey.distro_series})`
    : null;

  useWindowTitle("License keys");

  useAddMessage(
    saved,
    licenseKeysActions.cleanup,
    `License key ${title} removed successfully.`,
    setDeleting
  );

  useAddMessage(
    hasErrors && typeof errors === "string",
    licenseKeysActions.cleanup,
    `Error removing license key ${title}: ${errors}`,
    null,
    "negative"
  );

  const hideExpanded = () => {
    setExpandedId();
  };

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
          rows={generateRows(
            licenseKeys,
            expandedId,
            setExpandedId,
            hideExpanded,
            dispatch,
            setDeleting
          )}
          sortable={true}
        />
      )}
    </>
  );
};

export default LicenseKeyList;
