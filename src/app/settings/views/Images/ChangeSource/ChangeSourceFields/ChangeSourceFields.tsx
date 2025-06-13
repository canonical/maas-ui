import type { ReactElement } from "react";
import React from "react";

import { Col, Icon, Row, Textarea, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FormikField from "@/app/base/components/FormikField";
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

const ChangeSourceFields = (): ReactElement => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<ChangeSourceValues>();
  const { keyring_data, keyring_filename, source_type } = values;

  return (
    <Row>
      <Col size={12}>
        <ul className="p-inline-list">
          <li className="p-inline-list__item u-display--inline-block">
            <FormikField
              id="maas-source"
              label={Labels.MaasIo}
              name="source_type"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                handleChange(e);
                void setFieldValue("url", "");
                void setFieldValue("keyring_data", "");
                void setFieldValue("keyring_filename", "");
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
                void setFieldValue("keyring_data", "");
                void setFieldValue("keyring_filename", "");
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
