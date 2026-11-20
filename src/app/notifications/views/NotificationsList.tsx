import { useState, type ReactElement } from "react";

import NotificationsListHeader from "../components/NotificationsListHeader/NotificationsListHeader";
import NotificationsTable from "../components/NotificationsTable/NotificationsTable";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { NotificationSeverityFilter } from "@/app/notifications/constants";

const NotificationsList = (): ReactElement => {
  useWindowTitle("Notifications");

  const [filter, setFilter] = useState(NotificationSeverityFilter.All);

  return (
    <PageContent
      header={<NotificationsListHeader filter={filter} setFilter={setFilter} />}
    >
      <NotificationsTable filter={filter} />
    </PageContent>
  );
};

export default NotificationsList;
