import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import LicenseKeyFormFields from "../LicenseKeyFormFields";

import type { LicenseKeyFormValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import settingsURLs from "app/settings/urls";
import { actions as generalActions } from "app/store/general";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import { actions as licenseKeysActions } from "app/store/licensekeys";
import licenseKeysSelectors from "app/store/licensekeys/selectors";
import type { LicenseKeys } from "app/store/licensekeys/types";
import { LicenseKeysMeta } from "app/store/licensekeys/types";

type Props = {
  licenseKey?: LicenseKeys;
};

const LicenseKeySchema = Yup.object().shape({
  osystem: Yup.string().required("Operating system is required"),
  distro_series: Yup.string().required("Release is required"),
  license_key: Yup.string().required("A license key is required"),
});

export const LicenseKeyForm = ({ licenseKey }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savingLicenseKey, setSaving] = useState<string | null>(null);
  const saving = useSelector(licenseKeysSelectors.saving);
  const saved = useSelector(licenseKeysSelectors.saved);
  const errors = useSelector(licenseKeysSelectors.errors);
  const osInfoLoaded = useSelector(osInfoSelectors.loaded);
  const licenseKeysLoaded = useSelector(licenseKeysSelectors.loaded);
  const releases = useSelector(osInfoSelectors.getLicensedOsReleases);
  const osystems = useSelector(osInfoSelectors.getLicensedOsystems);
  const isLoaded = licenseKeysLoaded && osInfoLoaded;

  const title = licenseKey ? "Update license key" : "Add license key";

  useWindowTitle(title);

  const editing = !!licenseKey;

  useAddMessage(
    saved,
    licenseKeysActions.cleanup,
    `${savingLicenseKey} ${editing ? "updated" : "added"} successfully.`,
    () => setSaving(null)
  );

  useEffect(() => {
    if (!osInfoLoaded) {
      dispatch(generalActions.fetchOsInfo());
    }
    if (!licenseKeysLoaded) {
      dispatch(licenseKeysActions.fetch());
    }
  }, [dispatch, osInfoLoaded, licenseKeysLoaded]);

  return (
    <FormCard title={title}>
      {!isLoaded ? (
        <Spinner text="loading..." />
      ) : osystems.length > 0 ? (
        <Formik
          initialValues={{
            osystem: licenseKey ? licenseKey.osystem : osystems[0][0],
            distro_series: licenseKey
              ? licenseKey.distro_series
              : releases[osystems[0][0]][0].value,
            license_key: licenseKey ? licenseKey.license_key : "",
          }}
          onSubmit={(values) => {
            const params = {
              osystem: values.osystem,
              distro_series: values.distro_series,
              license_key: values.license_key,
            };
            if (editing) {
              if (licenseKey) {
                dispatch(
                  licenseKeysActions.update({
                    ...params,
                    [LicenseKeysMeta.PK]: licenseKey[LicenseKeysMeta.PK],
                  })
                );
              }
            } else {
              dispatch(licenseKeysActions.create(params));
            }
            setSaving(`${params.osystem} (${params.distro_series})`);
          }}
          validationSchema={LicenseKeySchema}
        >
          <FormikFormContent<LicenseKeyFormValues>
            cleanup={licenseKeysActions.cleanup}
            errors={errors}
            onCancel={() =>
              history.push({ pathname: settingsURLs.licenseKeys.index })
            }
            onSaveAnalytics={{
              action: "Saved",
              category: "License keys settings",
              label: `${title} form`,
            }}
            saving={saving}
            saved={saved}
            savedRedirect={settingsURLs.licenseKeys.index}
            submitLabel={editing ? "Update license key" : "Add license key"}
          >
            <LicenseKeyFormFields osystems={osystems} releases={releases} />
          </FormikFormContent>
        </Formik>
      ) : (
        <span>No available licensed operating systems.</span>
      )}
    </FormCard>
  );
};

export default LicenseKeyForm;
