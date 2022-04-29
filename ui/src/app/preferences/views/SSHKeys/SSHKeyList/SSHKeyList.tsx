import { Link } from "@canonical/react-components";

import BaseSSHKeyList from "app/base/components/SSHKeyList";
import docsUrls from "app/base/docsUrls";
import { useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";

const SSHKeyList = (): JSX.Element => {
  useWindowTitle("SSH keys");
  return (
    <>
      <BaseSSHKeyList
        buttons={[{ label: "Import SSH key", url: prefsURLs.sshKeys.add }]}
      />
      <Link href={docsUrls.sshKeys} rel="noreferrer noopener" target="_blank">
        About SSH keys
      </Link>
    </>
  );
};

export default SSHKeyList;
