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
      if (active) {
        collection.push(
          <Notification key={i} severity={severity} title={title}>
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
      <div className="row">{notificationList}</div>
    </section>
  );
};

export default MachineNotifications;
