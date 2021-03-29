import { Button, Notification } from "@canonical/react-components";
import type { notificationTypes } from "@canonical/react-components";
import classNames from "classnames";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import type { Dispatch } from "redux";

import NotificationGroupNotification from "./Notification";

import { useVisible } from "app/base/hooks";
import { actions as notificationActions } from "app/store/notification";
import type { Notification as NotificationType } from "app/store/notification/types";
import { capitaliseFirst } from "app/utils";

const dismissAll = (notifications: NotificationType[], dispatch: Dispatch) => {
  notifications.forEach((notification) => {
    if (notification.dismissable) {
      dispatch(notificationActions.dismiss(notification.id));
    }
  });
};

type Props = {
  notifications: NotificationType[];
  type: notificationTypes;
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

  const dismissable = notifications.some(({ dismissable }) => !!dismissable);

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
          {dismissable ? (
            <Button
              appearance="link"
              className="p-notification__action u-nudge-right"
              onClick={() => dismissAll(notifications, dispatch)}
            >
              Dismiss all
            </Button>
          ) : null}
        </Notification>
      ) : null}
      {((groupOpen && notifications.length > 1) ||
        notifications.length === 1) &&
        notifications.map(({ id }) => (
          <NotificationGroupNotification key={id} id={id} type={type} />
        ))}
    </div>
  );
};

NotificationGroup.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired,
};

export default NotificationGroup;
