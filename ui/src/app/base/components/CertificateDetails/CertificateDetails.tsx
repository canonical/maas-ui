import { useState } from "react";

import { Button, Icon, Link, Textarea } from "@canonical/react-components";

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
  privateKey: CertificateData["private_key"];
};

const CertificateDetails = ({
  certificate,
  eventCategory,
  metadata,
  privateKey,
}: Props): JSX.Element => {
  const [showKey, setShowKey] = useState(false);
  const sendAnalytics = useSendAnalytics();

  return (
    <div className="certificate-details">
      <p>Certificate</p>
      <p>
        <Link
          data-test="read-more-link"
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
      <Textarea
        className="p-textarea--readonly"
        id="lxd-cert"
        readOnly
        rows={5}
        value={certificate}
      />
      <p>Private key</p>
      {showKey && (
        <Textarea
          className="p-textarea--readonly"
          data-test="private-key"
          id="lxd-key"
          readOnly
          rows={5}
          value={privateKey}
        />
      )}
      <Button
        data-test="toggle-key"
        onClick={() => setShowKey(!showKey)}
        type="button"
      >
        {showKey ? (
          "Close"
        ) : (
          <>
            <span className="u-nudge-left--small">
              <Icon name="begin-downloading" />
            </span>
            Fetch private key
          </>
        )}
      </Button>
    </div>
  );
};

export default CertificateDetails;
