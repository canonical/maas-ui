import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";

import {
  Col,
  Icon,
  Notification as NotificationBanner,
  Row,
  Select,
  Textarea,
  Tooltip,
} from "@canonical/react-components";
import { useFormikContext } from "formik";

import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import { MAAS_IO_DEFAULTS } from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";

export enum Labels {
  AutoSyncImages = "Automatically sync images",
  MaasIo = "maas.io",
  Custom = "Custom",
  Url = "URL",
  KeyringFilename = "Keyring filename",
  KeyringData = "Keyring data",
}

type ChangeSourceFieldsProps = {
  saved: boolean;
  saving: boolean;
};

const ChangeSourceFields = ({
  saved,
  saving,
}: ChangeSourceFieldsProps): ReactElement => {
  const { handleChange, setFieldValue, validateForm, values, initialValues } =
    useFormikContext<ChangeSourceValues>();
  const { keyring_data, keyring_filename, keyring_type, source_type, url } =
    values;

  const [selectedKeyringType, setSelectedKeyringType] = useState<
    "keyring_data" | "keyring_filename" | "keyring_unsigned"
  >(keyring_type || "keyring_filename");

  const customValuesRef = useRef(
    source_type === BootResourceSourceType.CUSTOM
      ? { url, keyring_filename, keyring_data }
      : { url: "", keyring_filename: "", keyring_data: "" }
  );

  const prevSourceTypeRef = useRef(source_type);

  useEffect(() => {
    const switchedToCustom =
      prevSourceTypeRef.current !== BootResourceSourceType.CUSTOM &&
      source_type === BootResourceSourceType.CUSTOM;

    prevSourceTypeRef.current = source_type;

    if (switchedToCustom) {
      return;
    }
    if (source_type === BootResourceSourceType.CUSTOM) {
      customValuesRef.current = {
        url,
        keyring_filename,
        keyring_data,
      };
    }
  }, [source_type, url, keyring_filename, keyring_data]);

  const onlyAutoSyncChanged =
    values.autoSync !== initialValues.autoSync &&
    values.url === initialValues.url &&
    values.keyring_data === initialValues.keyring_data &&
    values.keyring_filename === initialValues.keyring_filename &&
    values.source_type === initialValues.source_type;

  const sourceSettingsChanged =
    values.url !== initialValues.url ||
    values.keyring_data !== initialValues.keyring_data ||
    values.keyring_filename !== initialValues.keyring_filename ||
    values.source_type !== initialValues.source_type;

  const showSourceChangeWarning =
    !saved && !saving && !onlyAutoSyncChanged && sourceSettingsChanged;

  return (
    <Row>
      <Col size={12}>
        <ul className="p-inline-list">
          <li className="p-inline-list__item u-display--inline-block">
            <FormikField
              id="maas-source"
              label={Labels.MaasIo}
              name="source_type"
              onChange={async (e: React.FormEvent<HTMLInputElement>) => {
                handleChange(e);
                await setFieldValue("url", MAAS_IO_DEFAULTS.url).catch(
                  (reason: unknown) => {
                    throw new FormikFieldChangeError(
                      "url",
                      "setFieldValue",
                      reason as string
                    );
                  }
                );
                await setFieldValue(
                  "keyring_filename",
                  MAAS_IO_DEFAULTS.keyring_filename
                ).catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "keyring_filename",
                    "setFieldValue",
                    reason as string
                  );
                });
                await setFieldValue(
                  "keyring_data",
                  MAAS_IO_DEFAULTS.keyring_data
                ).catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "keyring_data",
                    "setFieldValue",
                    reason as string
                  );
                });
              }}
              type="radio"
              value={BootResourceSourceType.MAAS_IO}
            />
          </li>
          <li className="p-inline-list__item u-display--inline-block u-nudge-right">
            <FormikField
              id="custom-source"
              label={Labels.Custom}
              name="source_type"
              onChange={async (e: React.FormEvent<HTMLInputElement>) => {
                handleChange(e);
                const restoredValues = {
                  url: customValuesRef.current.url,
                  keyring_filename: customValuesRef.current.keyring_filename,
                  keyring_data: customValuesRef.current.keyring_data,
                };

                await setFieldValue("url", restoredValues.url).catch(
                  (reason: unknown) => {
                    throw new FormikFieldChangeError(
                      "url",
                      "setFieldValue",
                      reason as string
                    );
                  }
                );
                await setFieldValue(
                  "keyring_filename",
                  restoredValues.keyring_filename
                ).catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "keyring_filename",
                    "setFieldValue",
                    reason as string
                  );
                });
                await setFieldValue(
                  "keyring_data",
                  restoredValues.keyring_data
                ).catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "keyring_data",
                    "setFieldValue",
                    reason as string
                  );
                });
                await validateForm();
                customValuesRef.current = restoredValues;
              }}
              type="radio"
              value={BootResourceSourceType.CUSTOM}
            />
          </li>
        </ul>
        {showSourceChangeWarning && (
          <NotificationBanner
            data-testid="source-change-warning"
            severity="caution"
          >
            Changing the image source will remove all currently downloaded
            images.
          </NotificationBanner>
        )}
        {source_type === BootResourceSourceType.CUSTOM && (
          <>
            <FormikField
              label={Labels.Url}
              name="url"
              placeholder="e.g. http:// or https://"
              required
              type="text"
            />
            <Select
              label="Keyring"
              name="keyring_type"
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newType = e.target.value as
                  | "keyring_data"
                  | "keyring_filename";
                setSelectedKeyringType(newType);
                await setFieldValue("keyring_type", newType).catch(
                  (reason: unknown) => {
                    throw new FormikFieldChangeError(
                      "keyring_type",
                      "setFieldValue",
                      reason as string
                    );
                  }
                );
                // Clear the other field when switching types
                if (newType === "keyring_filename") {
                  await setFieldValue("keyring_data", "").catch(
                    (reason: unknown) => {
                      throw new FormikFieldChangeError(
                        "keyring_data",
                        "setFieldValue",
                        reason as string
                      );
                    }
                  );
                } else if (newType === "keyring_data") {
                  await setFieldValue("keyring_filename", "").catch(
                    (reason: unknown) => {
                      throw new FormikFieldChangeError(
                        "keyring_filename",
                        "setFieldValue",
                        reason as string
                      );
                    }
                  );
                }
                await validateForm();
              }}
              options={[
                { label: "Keyring filename", value: "keyring_filename" },
                { label: "Keyring data", value: "keyring_data" },
                { label: "Unsigned", value: "keyring_unsigned" },
              ]}
              required
              value={selectedKeyringType}
            />
            {selectedKeyringType === "keyring_filename" ? (
              <FormikField
                help="Path to the keyring to validate the mirror path."
                name="keyring_filename"
                placeholder="e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
                required
                type="text"
              />
            ) : selectedKeyringType === "keyring_data" ? (
              <FormikField
                component={Textarea}
                help="Contents on the keyring to validate the mirror path."
                name="keyring_data"
                placeholder="Contents of GPG key (base64 encoded)"
                required
              />
            ) : null}
          </>
        )}
        <FormikField
          data-testid="auto-sync-switch"
          id="auto-sync-switch"
          label={
            <>
              {Labels.AutoSyncImages}
              <Tooltip
                className="u-nudge-right--small"
                message={`Enables hourly image updates (sync) from the source configured below.`}
              >
                <div className="u-nudge-right--x-large">
                  <Icon name="help" />
                </div>
              </Tooltip>
            </>
          }
          name="autoSync"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default ChangeSourceFields;
