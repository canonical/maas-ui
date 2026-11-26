import type { ChangeEvent } from "react";
import { useState } from "react";

import { ExternalLink, useSidePanel } from "@canonical/maas-react-components";
import { Col, Row, Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import Button from "@/app/base/components/Button";
import CodeBlock from "@/app/base/components/CodeBlock";
import docsUrls from "@/app/base/docsUrls";
import configSelectors from "@/app/store/config/selectors";
import { version as versionSelectors } from "@/app/store/general/selectors";

export const AddController = (): React.ReactElement => {
  const maasUrl = useSelector(configSelectors.maasUrl);
  const rpcSharedSecret = useSelector(configSelectors.rpcSharedSecret);
  const minorVersion = useSelector(versionSelectors.minor);
  const [variant, setVariant] = useState("snap");
  const { closeSidePanel } = useSidePanel();

  return (
    <>
      <p>
        To add a new rack controller, SSH into the rack controller and run the
        commands below. Confirm that the MAAS version is the same as the main
        rack controller.
      </p>
      <Select
        id="add-controller-version"
        label="Version"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setVariant(e.target.value);
        }}
        options={[
          {
            label: `v${minorVersion} Snap`,
            value: "snap",
          },
          {
            label: `v${minorVersion} Packages`,
            value: "packages",
          },
        ]}
        value={variant}
      />
      {variant === "packages" ? (
        <CodeBlock>
          {`sudo apt-add-repository ppa:maas/${minorVersion}\nsudo apt install maas-rack-controller`}
        </CodeBlock>
      ) : (
        <CodeBlock>{`sudo snap install maas --channel=${minorVersion}`}</CodeBlock>
      )}
      <p>
        Register the rack controller with this MAAS. If the rack controller (and
        machines) don't have access to the URL, use a different IP address to
        allow connection.
      </p>
      <CodeBlock data-testid="register-snippet">
        {variant === "packages"
          ? `sudo maas-rack register --url ${maasUrl} --secret ${rpcSharedSecret}`
          : `sudo maas init rack --maas-url ${maasUrl} --secret ${rpcSharedSecret}`}
      </CodeBlock>
      <Row>
        <Col size={6}>
          <ExternalLink to={docsUrls.rackController}>
            Help with adding a rack controller
          </ExternalLink>
        </Col>
        <Col className="u-align--right" size={6}>
          <Button data-testid="add-controller-close" onClick={closeSidePanel}>
            Close
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AddController;
