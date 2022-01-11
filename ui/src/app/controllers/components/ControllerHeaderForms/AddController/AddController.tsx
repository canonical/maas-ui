import { Button, Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { ClearHeaderContent } from "app/base/types";
import configSelectors from "app/store/config/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

export const AddController = ({ clearHeaderContent }: Props): JSX.Element => {
  const maasUrl = useSelector(configSelectors.maasUrl);
  const rpcSharedSecret = useSelector(configSelectors.rpcSharedSecret);

  return (
    <>
      <pre>
        <code data-testid="instructions">{`# To add a new rack controller, SSH into the rack controller.
# Install the maas-rack-controller package.
# Confirm that the MAAS version is the same as the main rack controller.
sudo apt install maas-rack-controller
# Or if you use snap
sudo snap install maas

# Register the rack controller with this MAAS. If the rack controller (and machines)
# don't have access to the URL, use a different IP address to allow connection.
sudo maas-rack register --url ${maasUrl} --secret ${rpcSharedSecret}
# Or if you use snap
sudo maas init rack --maas-url ${maasUrl} --secret ${rpcSharedSecret}`}</code>
      </pre>
      <Row>
        <Col size={6}>
          <a href="https://maas.io/docs/rack-controller">
            Help with adding a rack controller
          </a>
        </Col>
        <Col className="u-align--right" size={6}>
          <Button data-testid="close" onClick={clearHeaderContent}>
            Close
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AddController;
