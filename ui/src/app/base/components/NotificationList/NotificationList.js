import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import {
  messages as messageActions,
  notification as notificationActions,
} from "app/base/actions";
import NotificationGroup from "app/base/components/NotificationGroup";
import messageSelectors from "app/store/message/selectors";
import notificationSelectors from "app/store/notification/selectors";

const generateMessages = (messages, dispatch) =>
  messages.map(({ id, message, status, temporary, type }) => (
    <Notification
      close={() => dispatch(messageActions.remove(id))}
      key={id}
      status={status}
      timeout={temporary && 5000}
      type={type}
    >
      {message}
    </Notification>
  ));

const NotificationList = () => {
  const messages = useSelector(messageSelectors.all);

  const notifications = {
    warnings: {
      items: useSelector(notificationSelectors.warnings),
      type: "caution",
    },
    errors: {
      items: useSelector(notificationSelectors.errors),
      type: "negative",
    },
    success: {
      items: useSelector(notificationSelectors.success),
      type: "positive",
    },
    info: {
      items: useSelector(notificationSelectors.info),
      type: "information",
    },
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notificationActions.fetch());
  }, [dispatch]);

  return (
    <>
      {Object.keys(notifications).map((group) => {
        const type = notifications[group].type;
        if (notifications[group].items.length > 0) {
          return (
            <NotificationGroup
              key={type}
              type={type}
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
