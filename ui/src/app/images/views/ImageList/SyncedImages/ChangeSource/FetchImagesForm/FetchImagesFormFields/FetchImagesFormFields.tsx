import React, { useState } from "react";

import { Button, Col, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { FetchImagesValues } from "../FetchImagesForm";

import FormikField from "app/base/components/FormikField";
import { BootResourceSourceType } from "app/store/bootresource/types";

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
        <h4>Choose source</h4>
        <ul className="p-inline-list">
          <li className="p-inline-list__item u-display-inline-block">
            <FormikField
              id="maas-source"
              label="maas.io"
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
          <li className="p-inline-list__item u-display-inline-block u-nudge-right">
            <FormikField
              id="custom-source"
              label="Custom"
              name="source_type"
              type="radio"
              value={BootResourceSourceType.CUSTOM}
            />
          </li>
        </ul>
        {source_type === BootResourceSourceType.CUSTOM && (
          <>
            <FormikField
              label="URL"
              name="url"
              placeholder="e.g. http:// or https://"
              required
              type="text"
            />
            {showAdvanced ? (
              <>
                <FormikField
                  help="Path to the keyring to validate the mirror path."
                  label="Keyring filename"
                  name="keyring_filename"
                  placeholder="e.g. /usr/share/keyrings/ubuntu-clooudimage-keyring.gpg"
                  type="text"
                />
                <FormikField
                  component={Textarea}
                  help="Contents on the keyring to validate the mirror path."
                  label="Keyring data"
                  name="keyring_data"
                  placeholder="Contents of GPG key"
                />
                <Button
                  appearance="link"
                  className="u-sv2"
                  data-test="hide-advanced"
                  onClick={() => {
                    setShowAdvanced(false);
                    setFieldValue("keyring_data", "");
                    setFieldValue("keyring_filename", "");
                  }}
                >
                  Hide advanced...
                </Button>
              </>
            ) : (
              <Button
                appearance="link"
                className="u-sv2"
                data-test="show-advanced"
                onClick={() => setShowAdvanced(true)}
              >
                Show advanced...
              </Button>
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default FetchImagesFormFields;
