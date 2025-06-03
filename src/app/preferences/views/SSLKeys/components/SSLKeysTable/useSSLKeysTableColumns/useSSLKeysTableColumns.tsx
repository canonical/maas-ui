import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { SslKeyResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import { SSLKeyActionSidePanelViews } from "@/app/preferences/views/SSLKeys/constants";

type SSLKeysColumnDef = ColumnDef<SslKeyResponse, Partial<SslKeyResponse>>;

const useSSLKeysTableColumns = (): SSLKeysColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "key",
          accessorKey: "key",
          enableSorting: true,
          header: "Key",
        },
        {
          id: "action",
          accessorKey: "id",
          enableSorting: false,
          header: "Action",
          cell: ({
            row: {
              original: { id },
            },
          }) => {
            return (
              <TableActions
                data-testid="ssh-key-actions"
                onDelete={() => {
                  setSidePanelContent({
                    view: SSLKeyActionSidePanelViews.DELETE_SSL_KEY,
                    extras: {
                      sslKeyId: id,
                    },
                  });
                }}
              />
            );
          },
        },
      ] as SSLKeysColumnDef[],
    [setSidePanelContent]
  );
};

export default useSSLKeysTableColumns;
