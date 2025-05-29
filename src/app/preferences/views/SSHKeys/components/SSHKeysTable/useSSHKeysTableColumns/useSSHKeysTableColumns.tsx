import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { SshKeyResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { SSHKeyValue } from "@/app/preferences/views/SSHKeys/components/SSHKeysTable/SSHKeysTable";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";

type SSHKeysColumnDef = ColumnDef<SSHKeyValue, Partial<SSHKeyValue>>;

const formatKey = (key: SshKeyResponse["key"]) => {
  const parts = key.split(" ");
  if (parts.length >= 3) {
    return parts.slice(2).join(" ");
  }
  return key;
};

const useSSHKeysTableColumns = (): SSHKeysColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "source",
          accessorKey: "source",
          enableSorting: true,
          header: "Source",
        },
        {
          id: "auth_id",
          accessorKey: "auth_id",
          enableSorting: true,
          header: "ID",
        },
        {
          id: "keys",
          accessorKey: "keys",
          enableSorting: true,
          header: "Key",
          cell: ({
            row: {
              original: { keys },
            },
          }) => (
            <ul className="p-table-sub-cols__list">
              {keys.map((key) => (
                <div
                  className="p-table-sub-cols__item sshkey-list__keys"
                  key={key.key}
                >
                  <div className="sshkey-list__keys-key" title={key.key}>
                    {formatKey(key.key)}
                  </div>
                </div>
              ))}
            </ul>
          ),
        },
        {
          id: "action",
          accessorKey: "id",
          enableSorting: false,
          header: "Action",
          cell: ({
            row: {
              original: { keys },
            },
          }) => {
            return (
              <TableActions
                data-testid="ssh-key-actions"
                onDelete={() => {
                  setSidePanelContent({
                    view: SSHKeyActionSidePanelViews.DELETE_SSH_KEY,
                    extras: {
                      sshKeyIds: keys.map((key) => key.id),
                    },
                  });
                }}
              />
            );
          },
        },
      ] as SSHKeysColumnDef[],
    [setSidePanelContent]
  );
};

export default useSSHKeysTableColumns;
