import type { ReactElement } from "react";

import {
  ExternalLink,
  GenericTable,
  MainToolbar,
} from "@canonical/maas-react-components";
import { Button, Notification } from "@canonical/react-components";

import { useListSshKeys } from "@/app/api/query/sshKeys";
import type { SshKeyResponse } from "@/app/apiclient";
import docsUrls from "@/app/base/docsUrls";
import { useSidePanel } from "@/app/base/side-panel-context";
import useSSHKeysTableColumns from "@/app/preferences/views/SSHKeys/components/SSHKeysTable/useSSHKeysTableColumns/useSSHKeysTableColumns";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";

type SSHKeysTableProps = {
  isIntro: boolean;
};

export type SSHKeyValue = {
  id: number;
  auth_id: SshKeyResponse["auth_id"] | null;
  keys: SshKeyResponse[];
  source: string;
};

type SSHKeyGroups = Record<string, SSHKeyValue>;

const groupBySource = (sshKeys: SshKeyResponse[]): SSHKeyValue[] => {
  const sshKeyGroups: SSHKeyGroups = {};
  sshKeys.forEach((sshKey) => {
    const { protocol, auth_id, id } = sshKey;
    let groupKey: string;
    let source: SSHKeyValue["source"];
    if (protocol && auth_id) {
      groupKey = `${protocol}/${auth_id}`;
      source =
        (protocol === "lp" && "Launchpad") ||
        (protocol === "gh" && "GitHub") ||
        protocol;
    } else {
      groupKey = sshKey.auth_id ?? "";
      source = "Upload";
    }
    if (!sshKeyGroups[groupKey]) {
      sshKeyGroups[groupKey] = {
        id,
        auth_id,
        keys: [sshKey],
        source,
      };
    } else {
      sshKeyGroups[groupKey].keys.push(sshKey);
    }
  });
  return Object.values(sshKeyGroups);
};

const SSHKeysTable = ({ isIntro = false }: SSHKeysTableProps): ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const { data, failureReason, isPending } = useListSshKeys();
  const sshKeys = groupBySource(data?.items ?? []);

  const columns = useSSHKeysTableColumns();

  return (
    <div className="ssh-keys-table" data-testid="ssh-keys-table">
      {failureReason && (
        <Notification severity="negative" title="Error:">
          {failureReason.message}
        </Notification>
      )}
      {!isIntro && (
        <MainToolbar>
          <MainToolbar.Controls>
            <Button
              onClick={() => {
                setSidePanelContent({
                  view: SSHKeyActionSidePanelViews.ADD_SSH_KEY,
                });
              }}
            >
              Import SSH key
            </Button>
          </MainToolbar.Controls>
        </MainToolbar>
      )}
      <GenericTable
        columns={columns}
        data={sshKeys}
        isLoading={isPending}
        noData="No SSH keys available."
        variant="regular"
      />
      <ExternalLink to={docsUrls.sshKeys}>About SSH keys</ExternalLink>
    </div>
  );
};

export default SSHKeysTable;
