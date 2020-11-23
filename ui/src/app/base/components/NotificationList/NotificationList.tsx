import { Notification } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import { messages as messageActions } from "app/base/actions";
import NotificationGroup from "app/base/components/NotificationGroup";
import messageSelectors from "app/store/message/selectors";
import { actions as notificationActions } from "app/store/notification";
import notificationSelectors from "app/store/notification/selectors";

import type { Message } from "app/store/message/types";

const generateMessages = (messages: Message[], dispatch: Dispatch) =>
  messages.map(({ id, message, temporary, type }) => (
    <Notification
      close={() => dispatch(messageActions.remove(id))}
      data-test="message"
      key={id}
      timeout={temporary && 5000}
      type={type}
    >
      {message}
    </Notification>
  ));

const NotificationList = (): JSX.Element => {
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
