import { Card, Col, Icon, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { MaasIntroValues } from "../types";

import FormikField from "app/base/components/FormikField";

const ConnectivityCard = (): JSX.Element => {
  const { errors } = useFormikContext<MaasIntroValues>();
  const showErrorIcon =
    errors.httpProxy ||
    errors.mainArchiveUrl ||
    errors.portsArchiveUrl ||
    errors.upstreamDns;

  return (
    <Card
      className="maas-intro__card"
      data-test="maas-connectivity-form"
      highlighted
      title={
        <>
          <span className="p-heading--4 u-sv1">
            <Icon name={showErrorIcon ? "error" : "success"} /> Connectivity
          </span>
          <hr />
        </>
      }
    >
      <Row>
        <Col size="6">
          <FormikField
            help="A space-separated list of upstream DNS servers to which MAAS should forward requests for domains not managed by MAAS directly."
            label="DNS forwarder"
            name="upstreamDns"
            placeholder="e.g: 8.8.8.8 8.8.4.4"
            type="text"
          />
          <FormikField
            help="The server where machines retrieve packages for Intel architectures."
            label="Ubuntu archive"
            name="mainArchiveUrl"
            type="text"
          />
          <FormikField
            help="Archive used by machines to retrieve packages for non-Intel architectures."
            label="Ubuntu extra architectures"
            name="portsArchiveUrl"
            type="text"
          />
          <FormikField
            help="This will be passed onto deployed machines to use as a proxy for APT and YUM traffic. MAAS also uses the proxy for downloading boot images. If no URL is provided, the built-in MAAS proxy will be used."
            label="APT &amp; HTTP/HTTPS proxy server"
            name="httpProxy"
            type="text"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ConnectivityCard;
