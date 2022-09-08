import React, { useState } from "react";

import { Button, Col, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { FetchImagesValues } from "../FetchImagesForm";

import FormikField from "app/base/components/FormikField";
import { BootResourceSourceType } from "app/store/bootresource/types";

export enum Labels {
  ChooseSource = "Choose source",
  MaasIo = "maas.io",
  Custom = "Custom",
  Url = "URL",
  KeyringFilename = "Keyring filename",
  KeyringData = "Keyring data",
  ShowAdvanced = "Show advanced...",
  HideAdvanced = "Hide advanced...",
}

const FetchImagesFormFields = (): JSX.Element => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<FetchImagesValues>();
  const { keyring_data, keyring_filename, source_type } = values;
  const [showAdvanced, setShowAdvanced] = useState(
    !!(keyring_data || keyring_filename)
  );

  return (
    <Row>
      <Col size={6}>
        <h4>{Labels.ChooseSource}</h4>
        <ul className="p-inline-list">
          <li className="p-inline-list__item u-display--inline-block">
            <FormikField
              id="maas-source"
              label={Labels.MaasIo}
              name="source_type"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                handleChange(e);
                setFieldValue("url", "");
                setFieldValue("keyring_data", "");
                setFieldValue("keyring_filename", "");
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
            {showAdvanced ? (
              <>
                <FormikField
                  help="Path to the keyring to validate the mirror path."
                  label={Labels.KeyringFilename}
                  name="keyring_filename"
                  placeholder="e.g. /usr/share/keyrings/ubuntu-clooudimage-keyring.gpg"
                  type="text"
                />
                <FormikField
                  component={Textarea}
                  help="Contents on the keyring to validate the mirror path."
                  label={Labels.KeyringData}
                  name="keyring_data"
                  placeholder="Contents of GPG key"
                />
                <Button
                  appearance="link"
                  data-testid="hide-advanced"
                  onClick={() => {
                    setShowAdvanced(false);
                    setFieldValue("keyring_data", "");
                    setFieldValue("keyring_filename", "");
                  }}
                >
                  {Labels.HideAdvanced}
                </Button>
              </>
            ) : (
              <Button
                appearance="link"
                data-testid="show-advanced"
                onClick={() => setShowAdvanced(true)}
              >
                {Labels.ShowAdvanced}
              </Button>
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default FetchImagesFormFields;
