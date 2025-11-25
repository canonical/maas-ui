import type { ReactElement } from "react";
import React, { useEffect, useRef } from "react";

import { Col, Icon, Row, Textarea, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import ShowAdvanced from "@/app/base/components/ShowAdvanced";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";

export enum Labels {
  AutoSyncImages = "Automatically sync images",
  MaasIo = "maas.io",
  Custom = "Custom",
  Url = "URL",
  KeyringFilename = "Keyring filename",
  KeyringData = "Keyring data",
  ShowAdvanced = "Show advanced...",
  HideAdvanced = "Hide advanced...",
}

const MAAS_IO_DEFAULTS = {
  url: "http://images.maas.io/ephemeral-v3/stable/",
  keyring_filename:
    "/snap/maas/current/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
  keyring_data: "",
};

const ChangeSourceFields = (): ReactElement => {
  const { handleChange, setFieldValue, validateForm, values } =
    useFormikContext<ChangeSourceValues>();
  const { keyring_data, keyring_filename, source_type, url } = values;

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
        {source_type === BootResourceSourceType.CUSTOM && (
          <>
            <FormikField
              label={Labels.Url}
              name="url"
              placeholder="e.g. http:// or https://"
              required
              type="text"
            />
            <ShowAdvanced
              initialIsShown={!!(keyring_data || keyring_filename)}
              onAfterHide={() => {
                setFieldValue("keyring_data", "").catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "keyring_data",
                    "setFieldValue",
                    reason as string
                  );
                });
                setFieldValue("keyring_filename", "").catch(
                  (reason: unknown) => {
                    throw new FormikFieldChangeError(
                      "keyring_filename",
                      "setFieldValue",
                      reason as string
                    );
                  }
                );
              }}
            >
              <FormikField
                help="Path to the keyring to validate the mirror path."
                label={Labels.KeyringFilename}
                name="keyring_filename"
                placeholder="e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
                type="text"
              />
              <FormikField
                component={Textarea}
                help="Contents on the keyring to validate the mirror path."
                label={Labels.KeyringData}
                name="keyring_data"
                placeholder="Contents of GPG key (base64 encoded)"
              />
            </ShowAdvanced>
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
