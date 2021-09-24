import { Input } from "@canonical/react-components";

import UploadTextArea from "app/base/components/UploadTextArea";

type Props = {
  certificateFieldName?: string;
  onShouldGenerateCert: (shouldGenerateCert: boolean) => void;
  privateKeyFieldName?: string;
  shouldGenerateCert: boolean;
};

export const CertificateFields = ({
  certificateFieldName = "certificate",
  onShouldGenerateCert,
  privateKeyFieldName = "key",
  shouldGenerateCert,
}: Props): JSX.Element => {
  return (
    <>
      <p>Certificate</p>
      <Input
        checked={shouldGenerateCert}
        id="generate-certificate"
        label="Generate new certificate"
        onChange={() => onShouldGenerateCert(true)}
        type="radio"
      />
      <Input
        checked={!shouldGenerateCert}
        id="provide-certificate"
        label="Provide certificate and private key"
        onChange={() => onShouldGenerateCert(false)}
        type="radio"
        wrapperClassName="u-sv2"
      />
      {!shouldGenerateCert && (
        <>
          <UploadTextArea
            label="Upload certificate"
            name={certificateFieldName}
            placeholder="Paste or upload a certificate."
            rows={5}
          />
          <UploadTextArea
            label="Upload private key"
            name={privateKeyFieldName}
            placeholder="Paste or upload a private key."
            rows={5}
          />
        </>
      )}
    </>
  );
};

export default CertificateFields;
