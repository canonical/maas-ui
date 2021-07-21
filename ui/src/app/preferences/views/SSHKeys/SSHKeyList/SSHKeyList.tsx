import { Link } from "@canonical/react-components";

import BaseSSHKeyList from "app/base/components/SSHKeyList";
import { useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";

const SSHKeyList = (): JSX.Element => {
  useWindowTitle("SSH keys");
  return (
    <>
      <BaseSSHKeyList
        buttons={[{ label: "Import SSH key", url: prefsURLs.sshKeys.add }]}
      />
      <Link
        external
        href="https://maas.io/docs/user-accounts#heading--ssh-keys"
      >
        About SSH keys
      </Link>
    </>
  );
};

export default SSHKeyList;
