import {
  AddTrustedSSHHostKey,
  DeleteTrustedSSHHostKey,
  TrustedSSHHostKeysTable,
} from "../components";
import { TrustedSSHHostKeyActionSidePanelViews } from "../constants";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import { isId } from "@/app/utils";

const TrustedSSHHostKeys = (): React.ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("Trusted SSH host keys");

  const closeForm = () => {
    setSidePanelContent(null);
  };

  let content = null;

  if (
    sidePanelContent?.view ===
    TrustedSSHHostKeyActionSidePanelViews.ADD_TRUSTED_SSH_HOST_KEY
  ) {
    content = (
      <AddTrustedSSHHostKey closeForm={closeForm} key="add-ssh-host-key" />
    );
  } else if (
    sidePanelContent?.view ===
    TrustedSSHHostKeyActionSidePanelViews.DELETE_TRUSTED_SSH_HOST_KEY
  ) {
    const sshHostKeyId =
      sidePanelContent.extras && "sshHostKeyId" in sidePanelContent.extras
        ? sidePanelContent.extras.sshHostKeyId
        : null;
    content = isId(sshHostKeyId) ? (
      <DeleteTrustedSSHHostKey closeForm={closeForm} id={sshHostKeyId} />
    ) : null;
  }

  return (
    <PageContent
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle(
        "Trusted SSH host keys",
        sidePanelContent
      )}
    >
      <TrustedSSHHostKeysTable />
    </PageContent>
  );
};

export default TrustedSSHHostKeys;
