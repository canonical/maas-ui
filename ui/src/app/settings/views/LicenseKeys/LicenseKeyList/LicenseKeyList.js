import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

import settingsURLs from "app/settings/urls";
import { actions as licenseKeysActions } from "app/store/licensekeys";
import { actions as generalActions } from "app/store/general";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import licenseKeysSelectors from "app/store/licensekeys/selectors";

const generateRows = (
  licenseKeys,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch,
  setDeleting,
  saved,
  saving
) =>
  licenseKeys.map((licenseKey) => {
    const expanded = expandedId === licenseKey.license_key;

    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: licenseKey.osystem,
          role: "rowheader",
        },
        {
          content: licenseKey.distro_series,
        },
        {
          content: (
            <TableActions
              editPath={settingsURLs.licenseKeys.edit({
                distro_series: licenseKey.distro_series,
                osystem: licenseKey.osystem,
              })}
              onDelete={() => setExpandedId(licenseKey.license_key)}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          modelName={`${licenseKey.osystem} (${licenseKey.distro_series})`}
          modelType="license key"
          onClose={hideExpanded}
          onConfirm={() => {
            dispatch(licenseKeysActions.delete(licenseKey));
            setDeleting(licenseKey);
          }}
        />
      ),
      key: licenseKey.license_key,
      sortData: {
        osystem: licenseKey.osystem,
        title: licenseKey.title,
      },
    };
  });

const LicenseKeyList = () => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState();
  const [searchText, setSearchText] = useState("");
  const [deletingLicenseKey, setDeleting] = useState();

  const licenseKeysLoading = useSelector(licenseKeysSelectors.loading);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const osystems = useSelector(osInfoSelectors.getLicensedOsystems);
  const hasErrors = useSelector(licenseKeysSelectors.hasErrors);
  const errors = useSelector(licenseKeysSelectors.errors);
  const saved = useSelector(licenseKeysSelectors.saved);
  const saving = useSelector(licenseKeysSelectors.saving);

  const licenseKeys = useSelector((state) =>
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
    () => setDeleting(null)
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
    dispatch(generalActions.fetchOsInfo());
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
          url: settingsURLs.licenseKeys.add,
          disabled: addBtnDisabled,
          tooltip,
        },
      ]}
      headers={[
        {
          content: "Operating System",
          sortKey: "osystem",
        },
        {
          content: "Distro Series",
          sortKey: "distro_series",
        },
        {
          content: "Actions",
          className: "u-align--right",
        },
      ]}
      loaded={licenseKeysLoaded}
      loading={licenseKeysLoading}
      rows={generateRows(
        licenseKeys,
        expandedId,
        setExpandedId,
        hideExpanded,
        dispatch,
        setDeleting,
        saved,
        saving
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search license keys"
      searchText={searchText}
      tableClassName="license-key-list"
    />
  );
};

export default LicenseKeyList;
