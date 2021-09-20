import { useState } from "react";

import {
  Button,
  Col,
  Icon,
  Link,
  Row,
  Textarea,
} from "@canonical/react-components";

import UpdateCertificate from "./UpdateCertificate";

import FormCard from "app/base/components/FormCard";
import { useSendAnalytics } from "app/base/hooks";
import CertificateMetadata from "app/kvm/components/CertificateMetadata";
import type { PodDetails } from "app/store/pod/types";

type Props = {
  pod: PodDetails;
};

const AuthenticationCard = ({ pod }: Props): JSX.Element => {
  const [showUpdateCertificate, setShowUpdateCertificate] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const sendAnalytics = useSendAnalytics();
  const { certificate, power_parameters } = pod;
  const hasCertificateData = !!(
    certificate &&
    power_parameters.certificate &&
    power_parameters.key
  );

  return (
    <FormCard
      className="authentication-card"
      data-test="authentication-card"
      sidebar={false}
      title="Authentication"
    >
      {showUpdateCertificate || !hasCertificateData ? (
        <UpdateCertificate
          closeForm={() => setShowUpdateCertificate(false)}
          pod={pod}
          showCancel={hasCertificateData}
        />
      ) : (
        <Row>
          <Col size={6}>
            <p>Certificate</p>
            <p>
              <Link
                href="https://discourse.maas.io/t/lxd-authentication/4856"
                onClick={() =>
                  sendAnalytics(
                    "KVM configuration",
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
            <CertificateMetadata certificate={certificate} />
            <Textarea
              className="authentication-card__textarea"
              id="lxd-cert"
              readOnly
              rows={5}
              value={power_parameters.certificate}
            />
            <p>Private key</p>
            {showKey && (
              <Textarea
                className="authentication-card__textarea"
                data-test="private-key"
                id="lxd-key"
                readOnly
                rows={5}
                value={power_parameters.key}
              />
            )}
            <Button data-test="toggle-key" onClick={() => setShowKey(!showKey)}>
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
          </Col>
          <hr />
          <div className="u-align--right">
            <Button
              className="u-no-margin--bottom"
              data-test="show-update-certificate"
              onClick={() => setShowUpdateCertificate(true)}
            >
              <span className="u-nudge-left--small">
                <Icon name="change-version" />
              </span>
              Update certificate
            </Button>
          </div>
        </Row>
      )}
    </FormCard>
  );
};

export default AuthenticationCard;
