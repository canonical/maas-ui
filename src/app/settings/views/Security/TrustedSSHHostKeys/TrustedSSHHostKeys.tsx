import TrustedSSHHostKeysTable from "./components/TrustedSSHHostKeysTable";

import { useWindowTitle } from "@/app/base/hooks";

const TrustedSSHHostKeys = (): React.ReactElement => {
  useWindowTitle("Trusted SSH host keys");

  return <TrustedSSHHostKeysTable />;
};

export default TrustedSSHHostKeys;
