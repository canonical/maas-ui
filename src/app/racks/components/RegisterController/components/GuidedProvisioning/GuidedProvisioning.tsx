import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";

import { ExternalLink, useSidePanel } from "@canonical/maas-react-components";
import { Button, Select } from "@canonical/react-components";
import { InlineCode } from "@canonical/react-ds-global";

import { useGenerateToken } from "@/app/api/query/racks";
import CopyButton from "@/app/base/components/CopyButton";
import docsUrls from "@/app/base/docsUrls";
import "./_index.scss";

type GuidedProvisioningProps = {
  id: number;
};

const GuidedProvisioning = ({ id }: GuidedProvisioningProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const [maasVersion, setMaasVersion] = useState("3.7");
  const generateTokenMutation = useGenerateToken();
  return (
    <div>
      To register a controller to the rack using guided provisioning, SSH into
      the controller and run the commands below.
      <Select
        id="guided-provisioning-version"
        label="Version"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setMaasVersion(e.target.value);
        }}
        options={[{ label: "v3.7 Snap", value: "3.7" }]}
        value={maasVersion}
        wrapperClassName="u-nudge-down"
      />
      <pre className="p-code-block" data-testid="first-command-snippet">
        <InlineCode>
          {`sudo snap install maas-agent --channel=${maasVersion}`}
        </InlineCode>
      </pre>
      Generate a bootstrap token and use it to initialize the MAAS agent.
      <pre
        className="p-code-block u-nudge-down"
        data-testid="second-command-snippet"
      >
        <InlineCode>{"maas-agent init --token <TOKEN> "}</InlineCode>
      </pre>
      {generateTokenMutation.isSuccess ? (
        <div className="p-agent-token">
          <span className="u-flex--end">
            <CopyButton value={generateTokenMutation.data.token} />
          </span>
          <pre className="p-code-block">
            <InlineCode>{generateTokenMutation.data.token}</InlineCode>
          </pre>
        </div>
      ) : (
        <span className="u-flex--end">
          <Button
            onClick={() => {
              generateTokenMutation.mutate({ path: { rack_id: id } });
            }}
          >
            Generate token
          </Button>
        </span>
      )}
      <hr />
      <span className="u-flex--row u-flex--between">
        <p>
          <ExternalLink to={docsUrls.rackController}>
            Help with registering controllers
          </ExternalLink>
        </p>
        <Button
          onClick={() => {
            closeSidePanel();
          }}
        >
          Close
        </Button>
      </span>
    </div>
  );
};

export default GuidedProvisioning;
