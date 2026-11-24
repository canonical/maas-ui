import { useMemo } from "react";

import { Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import DeleteNotification from "../../DeleteNotification";

import type { NotificationResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useModal } from "@/app/base/modal-context";
import { NOTIFICATION_CATEGORY_ICONS } from "@/app/notifications/constants";

type NotificationsColumnDef = ColumnDef<NotificationResponse>;

// Backend notifications don't have a separate "title" field (just a free-text
// `message`), so the title shown here is derived from `category` the same
// way the toast notification bridge derives its default titles.
const DEFAULT_TITLES: Record<string, string> = {
  success: "Success",
  info: "Info",
  warning: "Warning",
  error: "Error",
};

const useNotificationsTableColumns = (): NotificationsColumnDef[] => {
  const { openModal } = useModal();
  return useMemo(
    () => [
      {
        id: "message",
        accessorKey: "message",
        enableSorting: false,
        header: "Message",
        cell: ({ row: { original } }) => original.message,
      },
      {
        id: "category",
        accessorKey: "category",
        enableSorting: false,
        header: "Category",
        cell: ({ row: { original } }) => (
          <>
            {NOTIFICATION_CATEGORY_ICONS[original.category] ? (
              <Icon name={NOTIFICATION_CATEGORY_ICONS[original.category]} />
            ) : null}
            <span className="u-nudge-right--small">
              {DEFAULT_TITLES[original.category] ?? original.category}
            </span>
          </>
        ),
      },
      {
        id: "action",
        enableSorting: false,
        header: "Action",
        // No actions exist yet for individual notifications (e.g. retry,
        // view logs). This column is a placeholder for that future work.
        cell: () => null,
      },
      {
        id: "delete",
        accessorKey: "id",
        enableSorting: false,
        header: "",
        cell: ({ row: { original } }) => (
          <TableActions
            deleteTooltip="Delete notification"
            onDelete={() => {
              openModal({
                component: DeleteNotification,
                title: "Delete notification",
                props: { id: original.id },
              });
            }}
          />
        ),
      },
    ],
    [openModal]
  );
};

export default useNotificationsTableColumns;
