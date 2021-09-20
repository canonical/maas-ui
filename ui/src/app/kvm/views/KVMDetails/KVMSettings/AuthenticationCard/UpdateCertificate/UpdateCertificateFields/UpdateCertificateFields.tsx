import { useState } from "react";

import { Button, Col, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { UpdateCertificateValues } from "../UpdateCertificate";

import AuthenticationFields from "app/base/components/AuthenticationFields";
import FormikField from "app/base/components/FormikField";
import CertificateDownload from "app/kvm/components/CertificateDownload";
import CertificateMetadata from "app/kvm/components/CertificateMetadata";
import type { GeneratedCertificate } from "app/store/general/types";

type Props = {
  generatedCertificate: GeneratedCertificate | null;
  shouldGenerateCert: boolean;
  setShouldGenerateCert: (shouldGenerateCert: boolean) => void;
};

const UpdateCertificateFields = ({
  generatedCertificate,
  shouldGenerateCert,
  setShouldGenerateCert,
}: Props): JSX.Element => {
  const [usePassword, setUsePassword] = useState(false);
  const { resetForm } = useFormikContext<UpdateCertificateValues>();

  return (
    <Row>
      <Col size={6}>
        {generatedCertificate ? (
          <div data-test="certificate-data">
            <CertificateMetadata certificate={generatedCertificate} />
            <p>Run the command below in the LXD CLI or use trust password:</p>
            <CertificateDownload
              certificateString={generatedCertificate.certificate}
            />
            <FormikField
              disabled={!usePassword}
              label="Use trust password (not secure!)"
              name="password"
              type="password"
            />
            {!usePassword && (
              <Button onClick={() => setUsePassword(true)}>Add</Button>
            )}
            <p>Private key</p>
            <Textarea
              className="authentication-card__textarea"
              id="private-key"
              readOnly
              rows={5}
              value={generatedCertificate.private_key}
            />
          </div>
        ) : (
          <AuthenticationFields
            data-test="authentication-fields"
            onShouldGenerateCert={(shouldGenerateCert) => {
              setShouldGenerateCert(shouldGenerateCert);
              resetForm();
            }}
            shouldGenerateCert={shouldGenerateCert}
            showPassword={false}
          />
        )}
      </Col>
    </Row>
  );
};

export default UpdateCertificateFields;
