import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "@canonical/react-components";
import { Link } from "react-router-dom";

import { isReleaseNotification } from "app/store/utils";
import { MessageType } from "app/store/message/types";
import { notification as notificationActions } from "app/base/actions";
import authSelectors from "app/store/auth/selectors";
import notificationSelectors from "app/store/notification/selectors";
import type { Notification as NotificationType } from "app/store/notification/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: NotificationType["id"];
  type: MessageType;
};

const NotificationGroupNotification = ({ id, type }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const notification = useSelector((state: RootState) =>
    notificationSelectors.getById(state, id)
  );
  const showSettings =
    isReleaseNotification(notification) && authUser?.is_superuser;
  return (
    <Notification
      className={showSettings ? "p-notification--has-action" : null}
      close={
        notification.dismissable
          ? () => dispatch(notificationActions.delete(id))
          : null
      }
      type={type}
    >
      <span
        className="p-notification__message"
        data-test="notification-message"
        dangerouslySetInnerHTML={{ __html: notification.message }}
      ></span>
      {showSettings ? (
        <>
          {" "}
          <Link
            to="/settings/configuration/general"
            className="p-notification__action"
          >
            See settings
          </Link>
        </>
      ) : null}
    </Notification>
  );
};

NotificationGroupNotification.propTypes = {
  id: PropTypes.number,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired,
};

export default NotificationGroupNotification;
