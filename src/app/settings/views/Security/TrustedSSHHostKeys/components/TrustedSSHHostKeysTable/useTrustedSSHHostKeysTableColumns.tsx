import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { SshHostKeyResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import { TrustedSSHHostKeyActionSidePanelViews } from "@/app/settings/views/Security/TrustedSSHHostKeys/constants";

type TrustedSSHHostKeysColumnDef = ColumnDef<
  SshHostKeyResponse,
  Partial<SshHostKeyResponse>
>;

const useTrustedSSHHostKeysTableColumns = (): TrustedSSHHostKeysColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();

  return useMemo(
    () => [
      {
        id: "host",
        accessorKey: "host",
        enableSorting: true,
        header: "Host",
        cell: ({ row: { original } }) => original.host || <>&mdash;</>,
      },
      {
        id: "key_type",
        accessorKey: "key_type",
        enableSorting: true,
        header: "Key type",
        cell: ({ row: { original } }) => original.key_type || <>&mdash;</>,
      },
      {
        id: "label",
        accessorKey: "label",
        enableSorting: true,
        header: "Label",
        cell: ({ row: { original } }) => original.label || <>&mdash;</>,
      },
      {
        id: "public_key",
        accessorKey: "public_key",
        enableSorting: true,
        header: "Public key",
        cell: ({ row: { original } }) => original.public_key || <>&mdash;</>,
      },
      {
        id: "created",
        accessorKey: "created",
        enableSorting: true,
        header: "Creation date",
        cell: ({ row: { original } }) => {
          if (!original.created) return <>&mdash;</>;
          return (
            new Date(original.created)
              .toLocaleString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "UTC",
                hour12: false,
              })
              .replace(",", "")
              .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:$3") + " (UTC)"
          );
        },
      },
      {
        id: "action",
        accessorKey: "id",
        enableSorting: false,
        header: "Actions",
        cell: ({ row: { original } }) => (
          <TableActions
            data-testid="trusted-ssh-host-key-actions"
            onDelete={() => {
              setSidePanelContent({
                view: TrustedSSHHostKeyActionSidePanelViews.DELETE_TRUSTED_SSH_HOST_KEY,
                extras: { sshHostKeyId: original.id },
              });
            }}
          />
        ),
      },
    ],
    [setSidePanelContent]
  );
};

export default useTrustedSSHHostKeysTableColumns;
