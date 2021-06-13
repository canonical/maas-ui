import { useState } from "react";

import { Button, Col, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { CustomSourceValues } from "../CustomSourceForm";

import FormikField from "app/base/components/FormikField";

const CustomSourceFormFields = (): JSX.Element => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const { setFieldValue } = useFormikContext<CustomSourceValues>();

  return (
    <Row>
      <Col size="6">
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
            data-test="show-advanced"
            onClick={() => setShowAdvanced(true)}
          >
            Show advanced...
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default CustomSourceFormFields;
