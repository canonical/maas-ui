import { useState } from "react";

import { Button, Col, Icon, Row } from "@canonical/react-components";

import UpdateCertificate from "./UpdateCertificate";

import CertificateDetails from "app/base/components/CertificateDetails";
import FormCard from "app/base/components/FormCard";
import type { PodDetails } from "app/store/pod/types";

type Props = {
  pod: PodDetails;
};

const AuthenticationCard = ({ pod }: Props): JSX.Element => {
  const [showUpdateCertificate, setShowUpdateCertificate] = useState(false);
  const { certificate: certificateMetadata, power_parameters } = pod;
  const hasCertificateData = !!(
    certificateMetadata &&
    power_parameters.certificate &&
    power_parameters.key
  );

  return (
    <FormCard
      className="authentication-card"
      data-test="authentication-card"
      highlighted={false}
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
            <CertificateDetails
              certificate={power_parameters.certificate as string}
              eventCategory="KVM configuration"
              metadata={certificateMetadata}
              privateKey={power_parameters.key as string}
            />
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
