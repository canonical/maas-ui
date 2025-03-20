import { ExternalLink } from "@canonical/maas-react-components";

import BaseSSHKeyList from "@/app/base/components/SSHKeyList";
import docsUrls from "@/app/base/docsUrls";
import { useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";

export enum Label {
  Title = "SSH keys",
}

const SSHKeyList = (): React.ReactElement => {
  useWindowTitle(Label.Title);
  return (
    <>
      <BaseSSHKeyList
        aria-label={Label.Title}
        buttons={[
          { label: "Import SSH key", url: urls.preferences.sshKeys.add },
        ]}
      />
      <ExternalLink to={docsUrls.sshKeys}>About SSH keys</ExternalLink>
    </>
  );
};

export default SSHKeyList;
