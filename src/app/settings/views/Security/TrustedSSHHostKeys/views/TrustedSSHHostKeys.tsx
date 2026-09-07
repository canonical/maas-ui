import { TrustedSSHHostKeysTable } from "../components";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

const TrustedSSHHostKeys = (): React.ReactElement => {
  useWindowTitle("Trusted SSH host keys");

  return (
    <PageContent>
      <TrustedSSHHostKeysTable />
    </PageContent>
  );
};

export default TrustedSSHHostKeys;
