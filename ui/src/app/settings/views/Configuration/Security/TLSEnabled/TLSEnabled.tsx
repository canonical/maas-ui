import { Icon } from "@canonical/react-components";

// TODO: Build "TLS enabled" version of security settings
// https://github.com/canonical-web-and-design/app-tribe/issues/821
const TLSEnabled = (): JSX.Element => (
  <p>
    <Icon name="lock-locked-active" />
    <span className="u-nudge-right--small">TLS enabled</span>
  </p>
);

export default TLSEnabled;
