import type { ReactNode } from "react";

import { Notification } from "@canonical/react-components";

type MachineNotification = {
  active: boolean;
  content: ReactNode;
  status?: string;
  type?: "caution" | "negative" | "positive" | "information";
};

type Props = {
  notifications: MachineNotification[];
};

const MachineNotifications = ({ notifications }: Props): JSX.Element => {
  const notificationList = notifications.reduce<ReactNode[]>(
    (collection, { active, content, status, type }, i) => {
      if (active) {
        collection.push(
          <Notification key={i} status={status} type={type}>
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
