import { useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import TableActions from "@/app/base/components/TableActions";
import TableDeleteConfirm from "@/app/base/components/TableDeleteConfirm";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import SettingsTable from "@/app/settings/components/SettingsTable";
import settingsURLs from "@/app/settings/urls";
import { generalActions } from "@/app/store/general";
import { osInfo as osInfoSelectors } from "@/app/store/general/selectors";
import { licenseKeysActions } from "@/app/store/licensekeys";
import licenseKeysSelectors from "@/app/store/licensekeys/selectors";
import type {
  LicenseKeys,
  LicenseKeysState,
} from "@/app/store/licensekeys/types";
import type { RootState } from "@/app/store/root/types";

const generateRows = (
  licenseKeys: LicenseKeys[],
  expandedId: LicenseKeys["license_key"] | null,
  setExpandedId: (expandedId: LicenseKeys["license_key"] | null) => void,
  hideExpanded: () => void,
  dispatch: Dispatch,
  saved: LicenseKeysState["saved"],
  saving: LicenseKeysState["saving"]
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
              onDelete={() => {
                setExpandedId(licenseKey.license_key);
              }}
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
          }}
        />
      ),
      key: licenseKey.license_key,
      sortData: {
        distro_series: licenseKey.distro_series,
        osystem: licenseKey.osystem,
      },
    };
  });

const LicenseKeyList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState<
    LicenseKeys["license_key"] | null
  >(null);
  const [searchText, setSearchText] = useState("");

  const licenseKeysLoading = useSelector(licenseKeysSelectors.loading);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const osystems = useSelector(osInfoSelectors.getLicensedOsystems);
  const saved = useSelector(licenseKeysSelectors.saved);
  const saving = useSelector(licenseKeysSelectors.saving);

  const licenseKeys = useSelector((state: RootState) =>
    licenseKeysSelectors.search(state, searchText)
  );

  useWindowTitle("License keys");

  const hideExpanded = () => {
    setExpandedId(null);
  };

  useFetchActions([licenseKeysActions.fetch, generalActions.fetchOsInfo]);

  const addBtnDisabled = osystems.length === 0;
  const tooltip = addBtnDisabled
    ? "No available licensed operating systems."
    : null;

  return (
    <ContentSection>
      <ContentSection.Content>
        <SettingsTable
          buttons={[
            {
              label: "Add license key",
              url: settingsURLs.licenseKeys.add,
              disabled: addBtnDisabled,
              tooltip,
            },
          ]}
          emptyStateMsg="No license keys available."
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
            saved,
            saving
          )}
          searchOnChange={setSearchText}
          searchPlaceholder="Search license keys"
          searchText={searchText}
          tableClassName="license-key-list"
          title="License keys"
        />
      </ContentSection.Content>
    </ContentSection>
  );
};

export default LicenseKeyList;
