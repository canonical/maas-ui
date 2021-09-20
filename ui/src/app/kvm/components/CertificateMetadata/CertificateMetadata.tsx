import { Card } from "@canonical/react-components";

import LabelledList from "app/base/components/LabelledList";
import type { GeneratedCertificate } from "app/store/general/types";
import type { PodCertificate } from "app/store/pod/types";

type Props = {
  certificate: GeneratedCertificate | PodCertificate;
};

const CertificateMetadata = ({ certificate }: Props): JSX.Element => {
  return (
    <Card className="certificate-metadata">
      <LabelledList
        className="certificate-metadata__list u-no-margin--bottom"
        items={[
          { label: "CN", value: certificate.CN },
          {
            label: "Expiration date",
            value: certificate.expiration,
          },
          {
            label: "Fingerprint",
            value: certificate.fingerprint,
          },
        ]}
      />
    </Card>
  );
};

export default CertificateMetadata;
