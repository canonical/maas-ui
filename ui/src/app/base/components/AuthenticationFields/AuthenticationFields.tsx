import { Button, Icon, Input, Textarea } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";

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
          {/*
          TODO: Build proper upload fields.
          https://github.com/canonical-web-and-design/app-squad/issues/244
        */}
          <Button>
            <span className="u-nudge-left--small">
              <Icon name="back-to-top" />
            </span>
            Upload certificate
          </Button>
          <FormikField
            component={Textarea}
            name={certificateValueName}
            placeholder="Paste or upload a certificate."
            rows={5}
            wrapperClassName="u-sv2"
          />
          <Button>
            <span className="u-nudge-left--small">
              <Icon name="back-to-top" />
            </span>
            Upload private key
          </Button>
          <FormikField
            component={Textarea}
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
