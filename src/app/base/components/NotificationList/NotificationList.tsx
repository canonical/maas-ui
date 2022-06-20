import { useEffect } from "react";

import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import NotificationGroup from "app/base/components/NotificationGroup";
import NotificationGroupNotification from "app/base/components/NotificationGroup/Notification";
import { actions as messageActions } from "app/store/message";
import messageSelectors from "app/store/message/selectors";
import type { Message } from "app/store/message/types";
import { actions as notificationActions } from "app/store/notification";
import notificationSelectors from "app/store/notification/selectors";

const generateMessages = (messages: Message[], dispatch: Dispatch) =>
  messages.map(({ id, message, severity, temporary }) => (
    <Notification
      data-testid="message"
      key={id}
      onDismiss={() => dispatch(messageActions.remove(id))}
      severity={severity}
      timeout={temporary ? 5000 : undefined}
    >
      {message}
    </Notification>
  ));

const NotificationList = (): JSX.Element => {
  const messages = useSelector(messageSelectors.all);

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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notificationActions.fetch());
  }, [dispatch]);

  return (
    <>
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
      {generateMessages(messages, dispatch)}
    </>
  );
};

export default NotificationList;
