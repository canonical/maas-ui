import type { ReactElement } from "react";
import { useEffect } from "react";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import {
  AddSSHKey,
  DeleteSSHKey,
  SSHKeysTable,
} from "@/app/preferences/views/SSHKeys/components";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";
import { isId } from "@/app/utils";

type SSHKeysListProps = {
  isIntro?: boolean;
};

const SSHKeysList = ({ isIntro = false }: SSHKeysListProps): ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("SSH Keys");

  const closeForm = () => {
    setSidePanelContent(null);
  };

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === SSHKeyActionSidePanelViews.ADD_SSH_KEY
  ) {
    content = <AddSSHKey closeForm={closeForm} key="add-ssh-key-form" />;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === SSHKeyActionSidePanelViews.DELETE_SSH_KEY
  ) {
    const sshKeyIds: number[] =
      sidePanelContent.extras && "sshKeyIds" in sidePanelContent.extras
        ? sidePanelContent.extras.sshKeyIds
        : [];
    content = sshKeyIds.every((id) => isId(id)) ? (
      <DeleteSSHKey closeForm={closeForm} ids={sshKeyIds} />
    ) : null;
  }

  return (
    <>
      {isIntro ? (
        <SSHKeysTable isIntro={true} />
      ) : (
        <PageContent
          sidePanelContent={content}
          sidePanelTitle={getSidePanelTitle("SSH keys", sidePanelContent)}
        >
          <SSHKeysTable isIntro={false} />
        </PageContent>
      )}
    </>
  );
};

export default SSHKeysList;
