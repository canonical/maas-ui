import { ExternalLink } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";

import CodeBlock from "@/app/base/components/CodeBlock";
import docsUrls from "@/app/base/docsUrls";

const TLSDisabled = (): React.ReactElement => {
  return (
    <>
      <p>
        <Icon name="warning" />
        <span className="u-nudge-right--small">TLS disabled</span>
      </p>
      <p>
        You can enable TLS with a certificate and a private key in the CLI with
        the following command:
      </p>
      <CodeBlock appearance="linux-prompt">
        {"sudo maas config-tls enable $key $cert --port YYYY"}
      </CodeBlock>
      <p>
        <ExternalLink to={docsUrls.aboutNativeTLS}>
          More about MAAS native TLS
        </ExternalLink>
      </p>
    </>
  );
};

export default TLSDisabled;
