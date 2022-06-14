import { Button, CodeSnippet, Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import docsUrls from "app/base/docsUrls";
import type { ClearHeaderContent } from "app/base/types";
import configSelectors from "app/store/config/selectors";
import { version as versionSelectors } from "app/store/general/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

export const AddController = ({ clearHeaderContent }: Props): JSX.Element => {
  const maasUrl = useSelector(configSelectors.maasUrl);
  const rpcSharedSecret = useSelector(configSelectors.rpcSharedSecret);
  const minorVersion = useSelector(versionSelectors.minor);

  return (
    <>
      <p>
        To add a new rack controller, SSH into the rack controller. Install the
        maas-rack-controller package. Confirm that the MAAS version is the same
        as the main rack controller.
      </p>
      <CodeSnippet
        blocks={[
          { code: `sudo apt-add-repository ppa:maas/${minorVersion}` },
          { code: "sudo apt update" },
          {
            code: "sudo apt install maas-rack-controller",
          },
        ]}
      />
      <p>Or if you use snap</p>
      <CodeSnippet
        blocks={[
          {
            code: `sudo snap install maas --channel=${minorVersion}`,
          },
        ]}
      />
      <p>
        Register the rack controller with this MAAS. If the rack controller (and
        machines) don't have access to the URL, use a different IP address to
        allow connection.
      </p>
      <CodeSnippet
        blocks={[
          {
            code: `sudo maas-rack register --url ${maasUrl} --secret ${rpcSharedSecret}`,
          },
        ]}
        data-testid="register-snippet"
      />
      <p>Or if you use snap</p>
      <CodeSnippet
        blocks={[
          {
            code: `sudo maas init rack --maas-url ${maasUrl} --secret ${rpcSharedSecret}`,
          },
        ]}
      />
      <Row>
        <Col size={6}>
          <a
            href={docsUrls.rackController}
            rel="noreferrer noopener"
            target="_blank"
          >
            Help with adding a rack controller
          </a>
        </Col>
        <Col className="u-align--right" size={6}>
          <Button
            data-testid="add-controller-close"
            onClick={clearHeaderContent}
          >
            Close
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AddController;
