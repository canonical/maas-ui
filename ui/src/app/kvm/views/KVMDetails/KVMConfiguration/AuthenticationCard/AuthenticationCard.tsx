import { useState } from "react";

import {
  Button,
  Card,
  Col,
  Icon,
  Link,
  Row,
  Textarea,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormCard from "app/base/components/FormCard";
import LabelledList from "app/base/components/LabelledList";
import { useSendAnalytics } from "app/base/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { isPodDetails } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const AuthenticationCard = ({ id }: Props): JSX.Element | null => {
  const [showKey, setShowKey] = useState(false);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const sendAnalytics = useSendAnalytics();

  if (!isPodDetails(pod)) {
    return null;
  }

  const { certificate, power_parameters } = pod;
  if (certificate && power_parameters.certificate && power_parameters.key) {
    return (
      <FormCard
        className="authentication-card"
        data-test="authentication-card"
        sidebar={false}
        title="Authentication"
      >
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
            <Card>
              <LabelledList
                className="authentication-card__metadata"
                items={[
                  { label: "CN", value: certificate.CN },
                  { label: "Expiration date", value: certificate.expiration },
                  { label: "Fingerprint", value: certificate.fingerprint },
                ]}
              />
            </Card>
            <Textarea
              className="authentication-card__textarea"
              id="lxd-cert"
              readOnly
              value={power_parameters.certificate}
            />
            <p>Private key</p>
            {showKey && (
              <Textarea
                className="authentication-card__textarea"
                data-test="private-key"
                id="lxd-key"
                readOnly
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
        </Row>
        <hr />
        <div className="u-align--right">
          <Button className="u-no-margin--bottom">
            <span className="u-nudge-left--small">
              <Icon name="change-version" />
            </span>
            Update certificate
          </Button>
        </div>
      </FormCard>
    );
  } else {
    // TODO: Handle pods that have not yet generated a certificate.
    // https://github.com/canonical-web-and-design/app-squad/issues/256
    return null;
  }
};

export default AuthenticationCard;
