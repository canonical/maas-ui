import { Input } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import UploadTextArea from "app/base/components/UploadTextArea";

type Props = {
  certificateValueName?: string;
  onShouldGenerateCert: (shouldGenerateCert: boolean) => void;
  passwordValueName?: string;
  privateKeyValueName?: string;
  shouldGenerateCert: boolean;
  showPassword?: boolean;
};

export const AuthenticationFields = ({
  certificateValueName = "certificate",
  onShouldGenerateCert,
  passwordValueName = "password",
  privateKeyValueName = "key",
  shouldGenerateCert,
  showPassword = true,
}: Props): JSX.Element => {
  return (
    <>
      <p>Authentication</p>
      <Input
        checked={shouldGenerateCert}
        id="generate-certificate"
        label="Generate new certificate"
        onChange={() => onShouldGenerateCert(true)}
        type="radio"
      />
      {shouldGenerateCert && showPassword && (
        <FormikField
          label="LXD password (optional)"
          name={passwordValueName}
          placeholder="Enter trust password"
          type="password"
          wrapperClassName="u-nudge-right--x-large u-sv1"
        />
      )}
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
            name={certificateValueName}
            placeholder="Paste or upload a certificate."
            rows={5}
          />
          <UploadTextArea
            label="Upload private key"
            name={privateKeyValueName}
            placeholder="Paste or upload a private key."
            rows={5}
          />
        </>
      )}
    </>
  );
};

export default AuthenticationFields;
