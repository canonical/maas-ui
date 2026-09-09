import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import NotificationGroup from "@/app/base/components/NotificationGroup";
import NotificationGroupNotification from "@/app/base/components/NotificationGroup/Notification";
import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
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

  const errors = useSelector(notificationSelectors.errors);
  const hardening = useSelector(notificationSelectors.hardening);
  const hardeningIds = new Set(hardening.map(({ id }) => id));

  return {
    warnings: {
      items: useSelector(notificationSelectors.warnings),
      severity: NotificationSeverity.CAUTION,
    },
    errors: {
      // Hardening notifications are surfaced as a single aggregated notification.
      items: errors.filter(({ id }) => !hardeningIds.has(id)),
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
};

const NotificationList = (): React.ReactElement => {
  const notifications = useNotifications();
  const hardeningNotifications = useSelector(notificationSelectors.hardening);
  const messages = useSelector(messageSelectors.all);
  const messageCount = useSelector(messageSelectors.count);
  const notificationCount = useSelector(notificationSelectors.count);
  const hasContent = messageCount > 0 || notificationCount > 0;
  const hardeningCount = hardeningNotifications.length;

  return (
    <div className={classNames({ "u-nudge-down": hasContent })}>
      {hardeningCount > 0 && (
        <Notification
          data-testid="hardening-notification"
          severity={NotificationSeverity.NEGATIVE}
        >
          Hardening has been enabled, but {hardeningCount} condition
          {hardeningCount === 1 ? "" : "s"}{" "}
          {hardeningCount === 1 ? "has" : "have"} not been met.{" "}
          <Link to={urls.settings.security.hardeningStatus}>
            Go to hardening settings...
          </Link>
        </Notification>
      )}
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
