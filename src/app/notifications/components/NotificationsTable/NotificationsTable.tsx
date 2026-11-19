import { useMemo } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import useNotificationsTableColumns from "./useNotificationsTableColumns/useNotificationsTableColumns";

import { useAllNotifications } from "@/app/api/query/notifications";
import type { NotificationSeverityFilter } from "@/app/notifications/constants";
import { NotificationSeverityFilter as Filter } from "@/app/notifications/constants";

import "./index.scss";

type Props = {
  filter: NotificationSeverityFilter;
};

const NotificationsTable = ({ filter }: Props) => {
  const notifications = useAllNotifications();
  const columns = useNotificationsTableColumns();

  const filteredItems = useMemo(() => {
    const items = notifications.data?.items ?? [];
    if (filter === Filter.All) {
      return items;
    }
    return items.filter((item) => item.category === filter);
  }, [notifications.data, filter]);

  return (
    <GenericTable
      aria-label="Notifications"
      className="notifications-table"
      columns={columns}
      data={filteredItems}
      isLoading={notifications.isPending}
      noData="No notifications found."
    />
  );
};

export default NotificationsTable;
