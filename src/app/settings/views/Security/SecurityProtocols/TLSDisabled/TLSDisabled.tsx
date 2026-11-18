import { ExternalLink } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";
import { InlineCode } from "@canonical/react-ds-global";

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
      <pre className="p-code-block p-code-block--linux-prompt">
        <InlineCode>
          {"sudo maas config-tls enable $key $cert --port YYYY"}
        </InlineCode>
      </pre>
      <p>
        <ExternalLink to={docsUrls.aboutNativeTLS}>
          More about MAAS native TLS
        </ExternalLink>
      </p>
    </>
  );
};

export default TLSDisabled;
