import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { SslKeyResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import { DeleteSSLKey } from "@/app/preferences/views/SSLKeys/components";

type SSLKeysColumnDef = ColumnDef<SslKeyResponse, Partial<SslKeyResponse>>;

const useSSLKeysTableColumns = (): SSLKeysColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "key",
          accessorKey: "key",
          enableSorting: true,
          header: "Key",
          cell: ({
            row: {
              original: { key },
            },
          }) => (
            <span className="u-truncate" title={key}>
              {key}
            </span>
          ),
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
                  openSidePanel({
                    component: DeleteSSLKey,
                    title: "Delete SSL key",
                    props: { id },
                  });
                }}
              />
            );
          },
        },
      ] as SSLKeysColumnDef[],
    [openSidePanel]
  );
};

export default useSSLKeysTableColumns;
