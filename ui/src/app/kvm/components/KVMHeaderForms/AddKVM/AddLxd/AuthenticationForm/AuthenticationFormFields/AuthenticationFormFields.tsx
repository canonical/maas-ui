import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AuthenticationFormValues } from "../AuthenticationForm";

import FormikField from "app/base/components/FormikField";
import CertificateDownload from "app/kvm/components/CertificateDownload";
import type { GeneratedCertificate } from "app/store/general/types";

type Props = {
  certificate: GeneratedCertificate | null;
  disabled: boolean;
  setUseCertificate: (useCert: boolean) => void;
  useCertificate: boolean;
};

export const AuthenticationForm = ({
  certificate,
  disabled,
  setUseCertificate,
  useCertificate,
}: Props): JSX.Element => {
  const { setFieldTouched, setFieldValue } =
    useFormikContext<AuthenticationFormValues>();

  return (
    <Row className="p-divider">
      <Col className="p-divider__block" size={6}>
        <Input
          checked={useCertificate}
          disabled={disabled}
          id="use-certificate"
          label="Add trust to LXD via command line"
          onChange={() => {
            setUseCertificate(true);
            setFieldTouched("password", false);
            setFieldValue("password", "");
          }}
          type="radio"
        />
        <p>Run the command below in the LXD CLI:</p>
        <CertificateDownload
          certificateString={certificate?.certificate || ""}
        />
      </Col>
      <Col className="p-divider__block" size={6}>
        <Input
          checked={!useCertificate}
          disabled={disabled}
          id="use-password"
          label="Use trust password (not secure!)"
          onChange={() => {
            setUseCertificate(false);
          }}
          type="radio"
        />
        <FormikField
          disabled={disabled || useCertificate}
          name="password"
          type="password"
        />
      </Col>
    </Row>
  );
};

export default AuthenticationForm;
