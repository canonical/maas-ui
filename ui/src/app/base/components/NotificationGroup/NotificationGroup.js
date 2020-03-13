import classNames from "classnames";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@canonical/react-components";

import { capitaliseFirst } from "app/utils";
import { useVisible } from "app/base/hooks";
import NotificationGroupMessage from "app/base/components/NotificationGroupMessage";
import { notification as notificationActions } from "app/base/actions";

export const notificationTypes = {
  CAUTION: "caution",
  INFORMATION: "information",
  NEGATIVE: "negative",
  POSITIVE: "positive"
};

const dismissAll = (notifications, dispatch) => {
  notifications.forEach(notification => {
    dismiss(notification.id, dispatch);
  });
};

const dismiss = (id, dispatch) => {
  dispatch(notificationActions.delete(id));
};

const NotificationGroup = ({ notifications, type }) => {
  const dispatch = useDispatch();
  const [groupOpen, toggleGroup] = useVisible(false);

  const notificationCount =
    type === "information"
      ? `${notifications.length} Other messages`
      : `${notifications.length} ${pluralize(
          capitaliseFirst(notifications[0].category, notifications.length)
        )}`;

  return (
    <div className="row p-notification--group">
      <div className={`p-notification--${type}`}>
        <div className="p-notification__toggle">
          {notifications.length > 1 ? (
            <p className="p-notification__response u-no-max-width">
              <Button
                appearance="link"
                onClick={toggleGroup}
                className="u-no-margin u-no-padding"
                aria-label={`${notifications.length} ${type}, click to open messages.`}
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
                      "p-icon--expand": !groupOpen
                    })}
                  ></i>
                </small>
              </Button>
              <Button
                appearance="link"
                className="p-notification__action u-no-margin u-no-padding"
                onClick={() => dismissAll(notifications, dispatch)}
              >
                Dismiss all
              </Button>
            </p>
          ) : (
            <NotificationGroupMessage
              message={notifications[0].message}
              id={notifications[0].id}
              action="Dismiss"
              actionHandler={dismiss}
            />
          )}
        </div>
        {groupOpen && notifications.length > 1 && (
          <ul className="p-list--divided u-no-margin--bottom">
            {notifications.map(notification => (
              <li key={notification.id} className="p-list__item">
                <NotificationGroupMessage
                  message={notification.message}
                  id={notification.id}
                  action="Dismiss"
                  actionHandler={dismiss}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

NotificationGroup.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired
};

export default NotificationGroup;
