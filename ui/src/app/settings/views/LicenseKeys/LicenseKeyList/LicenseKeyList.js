import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./LicenseKeyList.scss";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

import { licensekeys as licenseKeysActions } from "app/base/actions";
import { licensekeys as licenseKeysSelectors } from "app/base/selectors";
import { general as generalSelectors } from "app/base/selectors";

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
                to={`/settings/license-keys/${licenseKey.osystem}/${licenseKey.distro_series}/edit`}
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
  const osystems = useSelector(generalSelectors.osInfo.getLicensedOsystems);
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

  const addBtnDisabled = osystems.length === 0;
  const tooltip = addBtnDisabled
    ? "No available licensed operating systems."
    : null;

  return (
    <SettingsTable
      buttons={[
        {
          label: "Add license key",
          url: "/settings/license-keys/add",
          disabled: addBtnDisabled,
          tooltip
        }
      ]}
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
      loaded={licenseKeysLoaded}
      loading={licenseKeysLoading}
      rows={generateRows(
        licenseKeys,
        expandedId,
        setExpandedId,
        hideExpanded,
        dispatch,
        setDeleting
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search license keys"
      searchText={searchText}
      tableClassName="license-key-list"
    />
  );
};

export default LicenseKeyList;
