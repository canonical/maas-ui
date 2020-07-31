import classNames from "classnames";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Notification } from "@canonical/react-components";
import type { Dispatch } from "redux";

import { capitaliseFirst } from "app/utils";
import { isReleaseNotification } from "app/store/utils";
import { useVisible } from "app/base/hooks";
import { notification as notificationActions } from "app/base/actions";
import type { Notification as NotificationType } from "app/store/notification/types";
import type { MessageType } from "app/store/message/types";

const dismissAll = (notifications: NotificationType[], dispatch: Dispatch) => {
  notifications.forEach((notification) => {
    if (notification.dismissable) {
      dismiss(notification.id, dispatch);
    }
  });
};

const dismiss = (id: NotificationType["id"], dispatch: Dispatch) => {
  dispatch(notificationActions.delete(id));
};

type Props = {
  notifications: NotificationType[];
  type: MessageType;
};

const NotificationGroup = ({ notifications, type }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [groupOpen, toggleGroup] = useVisible(false);

  const notificationCount =
    type === "information"
      ? `${notifications.length} Other messages`
      : `${notifications.length} ${pluralize(
          capitaliseFirst(notifications[0].category),
          notifications.length
        )}`;

  return (
    <div className="p-notification--group">
      {notifications.length > 1 ? (
        <Notification type={type}>
          <Button
            appearance="link"
            aria-label={`${notifications.length} ${type}, click to open messages.`}
            onClick={toggleGroup}
          >
            <span
              className="p-notification__status"
              data-test="notification-count"
            >
              {notificationCount}
            </span>
            <small>
              <i
                className={classNames({
                  "p-icon--collapse": groupOpen,
                  "p-icon--expand": !groupOpen,
                })}
              ></i>
            </small>
          </Button>
          <Button
            appearance="link"
            className="p-notification__action u-nudge-right"
            onClick={() => dismissAll(notifications, dispatch)}
          >
            Dismiss all
          </Button>
        </Notification>
      ) : null}
      {((groupOpen && notifications.length > 1) ||
        notifications.length === 1) &&
        notifications.map((notification) => {
          const { dismissable, id, message } = notification;
          const showMenu = isReleaseNotification(notification);
          return (
            <Notification
              className={showMenu ? "p-notification--has-menu" : null}
              close={dismissable ? () => dismiss(id, dispatch) : null}
              key={id}
              type={type}
            >
              <span
                data-test="notification-message"
                dangerouslySetInnerHTML={{ __html: message }}
              ></span>
              {showMenu && (
                <Button
                  appearance="base"
                  className="p-notification__menu-button p-icon--contextual-menu"
                  hasIcon={true}
                >
                  Menu
                </Button>
              )}
            </Notification>
          );
        })}
    </div>
  );
};

NotificationGroup.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired,
};

export default NotificationGroup;
