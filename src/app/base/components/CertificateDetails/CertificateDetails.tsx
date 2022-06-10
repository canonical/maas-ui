import { Link } from "@canonical/react-components";

import CertificateDownload from "app/base/components/CertificateDownload";
import CertificateMetadata from "app/base/components/CertificateMetadata";
import { useSendAnalytics } from "app/base/hooks";
import type {
  CertificateData,
  CertificateMetadata as CertificateMetadataType,
} from "app/store/general/types";

type Props = {
  certificate: CertificateData["certificate"];
  eventCategory: string;
  metadata: CertificateMetadataType;
};

const CertificateDetails = ({
  certificate,
  eventCategory,
  metadata,
}: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  return (
    <div className="certificate-details">
      <p>Certificate</p>
      <p>
        <Link
          data-testid="read-more-link"
          href="https://discourse.maas.io/t/lxd-authentication/4856"
          onClick={() =>
            sendAnalytics(
              eventCategory,
              "Click link to LXD authentication discourse",
              "Read more about authentication"
            )
          }
          rel="noopener noreferrer"
          target="_blank"
        >
          Read more about authentication
        </Link>
      </p>
      <CertificateMetadata metadata={metadata} />
      <CertificateDownload certificate={certificate} filename={metadata.CN} />
    </div>
  );
};

export default CertificateDetails;
