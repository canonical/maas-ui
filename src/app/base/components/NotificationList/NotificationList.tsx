import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import NotificationGroup from "@/app/base/components/NotificationGroup";
import NotificationGroupNotification from "@/app/base/components/NotificationGroup/Notification";
import { useFetchActions } from "@/app/base/hooks";
import { messageActions } from "@/app/store/message";
import messageSelectors from "@/app/store/message/selectors";
import type { Message } from "@/app/store/message/types";
import { notificationActions } from "@/app/store/notification";
import notificationSelectors from "@/app/store/notification/selectors";

const Messages = ({ messages }: { messages: Message[] }) => {
  const dispatch = useDispatch();

  return (
    <>
      {messages.map(({ id, message, severity, temporary }) => (
        <Notification
          data-testid="message"
          key={id}
          onDismiss={() => dispatch(messageActions.remove(id))}
          severity={severity}
          timeout={temporary ? 5000 : undefined}
        >
          {message}
        </Notification>
      ))}
    </>
  );
};

export const useNotifications = () => {
  useFetchActions([notificationActions.fetch]);

  const notifications = {
    warnings: {
      items: useSelector(notificationSelectors.warnings),
      severity: NotificationSeverity.CAUTION,
    },
    errors: {
      items: useSelector(notificationSelectors.errors),
      severity: NotificationSeverity.NEGATIVE,
    },
    success: {
      items: useSelector(notificationSelectors.success),
      severity: NotificationSeverity.POSITIVE,
    },
    info: {
      items: useSelector(notificationSelectors.info),
      severity: NotificationSeverity.INFORMATION,
    },
  };

  return notifications;
};

const NotificationList = (): React.ReactElement => {
  const notifications = useNotifications();
  const messages = useSelector(messageSelectors.all);
  const messageCount = useSelector(messageSelectors.count);
  const notificationCount = useSelector(notificationSelectors.count);
  const hasContent = messageCount > 0 || notificationCount > 0;

  return (
    <div className={classNames({ "u-nudge-down": hasContent })}>
      {Object.values(notifications).map((group) => {
        const items = group.items;
        const severity = group.severity;
        if (items.length > 1) {
          return (
            <NotificationGroup
              key={severity}
              notifications={items}
              severity={severity}
            />
          );
        } else if (items.length === 1) {
          return (
            <NotificationGroupNotification
              id={items[0].id}
              key={severity}
              severity={severity}
            />
          );
        }
        return null;
      })}
      <Messages messages={messages} />
    </div>
  );
};

export default NotificationList;
