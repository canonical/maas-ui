import { useEffect } from "react";

import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import NotificationGroup from "app/base/components/NotificationGroup";
import { actions as messageActions } from "app/store/message";
import messageSelectors from "app/store/message/selectors";
import type { Message } from "app/store/message/types";
import { actions as notificationActions } from "app/store/notification";
import notificationSelectors from "app/store/notification/selectors";

const generateMessages = (messages: Message[], dispatch: Dispatch) =>
  messages.map(({ id, message, severity, temporary }) => (
    <Notification
      data-test="message"
      key={id}
      onDismiss={() => dispatch(messageActions.remove(id))}
      severity={severity}
      timeout={temporary && 5000}
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
      {Object.keys(notifications).map((group) => {
        const severity = notifications[group].severity;
        if (notifications[group].items.length > 0) {
          return (
            <NotificationGroup
              key={severity}
              severity={severity}
              notifications={notifications[group].items}
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
