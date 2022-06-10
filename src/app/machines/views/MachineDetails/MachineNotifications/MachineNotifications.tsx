import type { ReactNode } from "react";

import { Notification } from "@canonical/react-components";
import type { NotificationProps } from "@canonical/react-components";

type MachineNotification = {
  active: boolean;
  content: ReactNode;
  severity?: NotificationProps["severity"];
  title?: string;
};

type Props = {
  notifications: MachineNotification[];
};

const MachineNotifications = ({ notifications }: Props): JSX.Element => {
  const notificationList = notifications.reduce<ReactNode[]>(
    (collection, { active, content, severity, title }, i) => {
      // Use the `status` role for information that is not important enough to be an `alert`.
      const role = severity === "negative" ? "alert" : "status";
      if (active) {
        collection.push(
          <Notification key={i} role={role} severity={severity} title={title}>
            {content}
          </Notification>
        );
      }
      return collection;
    },
    []
  );

  return (
    <section className="p-strip u-no-padding--top u-no-padding--bottom">
      <div className="row" data-testid="machine-notifications-list">
        {notificationList}
      </div>
    </section>
  );
};

export default MachineNotifications;
