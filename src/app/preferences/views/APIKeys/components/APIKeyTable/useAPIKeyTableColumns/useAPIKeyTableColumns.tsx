import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import APIKeyDelete from "../../APIKeyDelete";
import APIKeyEdit from "../../APIKeyEdit";

import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { Token } from "@/app/store/token/types";

type APIKeyColumnDef = ColumnDef<Token, Partial<Token>>;

const useAPIKeyTableColumns = (): APIKeyColumnDef[] => {
  const { openSidePanel } = useSidePanel();

  const formatToken = (
    consumerKey: Token["consumer"]["key"],
    key: Token["key"],
    secret: Token["secret"]
  ): string => `${consumerKey}:${key}:${secret}`;

  return useMemo(
    (): APIKeyColumnDef[] => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row: { original: token } }) => token.consumer.name,
      },
      {
        id: "key",
        accessorKey: "key",
        header: "Key",
        enableSorting: false,
        cell: ({
          row: {
            original: { consumer, key, secret },
          },
        }) => formatToken(consumer.key, key, secret),
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({
          row: {
            original: { id, consumer, key, secret },
          },
        }) => (
          <TableActions
            copyValue={formatToken(consumer.key, key, secret)}
            onDelete={() => {
              openSidePanel({
                component: APIKeyDelete,
                props: { id },
                title: "Delete API key",
              });
            }}
            onEdit={() => {
              openSidePanel({
                component: APIKeyEdit,
                props: { id },
                title: "Edit API key",
              });
            }}
          />
        ),
      },
    ],
    [openSidePanel]
  );
};

export default useAPIKeyTableColumns;
