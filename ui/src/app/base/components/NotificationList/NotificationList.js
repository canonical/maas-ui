import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import {
  messages as messageActions,
  notification as notificationActions
} from "app/base/actions";
import { messages as messageSelectors } from "app/base/selectors";

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

const NotificationList = ({ children, sidebar, title }) => {
  const messages = useSelector(messageSelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notificationActions.fetch());
  }, [dispatch]);

  return <>{generateMessages(messages, dispatch)}</>;
};

export default NotificationList;
