import { Notification } from "@canonical/react-components";
import type { notificationTypes } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import authSelectors from "app/store/auth/selectors";
import { actions as notificationActions } from "app/store/notification";
import notificationSelectors from "app/store/notification/selectors";
import type { Notification as NotificationType } from "app/store/notification/types";
import {
  isReleaseNotification,
  isUpgradeNotification,
} from "app/store/notification/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  id: NotificationType["id"];
  type: notificationTypes;
};

const NotificationGroupNotification = ({
  id,
  type,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const notification = useSelector((state: RootState) =>
    notificationSelectors.getById(state, id)
  );
  if (!notification) {
    return null;
  }
  const showSettings =
    isReleaseNotification(notification) && authUser?.is_superuser;
  const showDate = isUpgradeNotification(notification);
  return (
    <Notification
      className={classNames({
        "p-notification--has-action": showSettings,
        "p-notification--has-date": showDate,
      })}
      close={
        notification.dismissable
          ? () => dispatch(notificationActions.dismiss(id))
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
      {showDate ? (
        <span className="p-notification__date u-text--muted">
          {notification.created}
        </span>
      ) : null}
    </Notification>
  );
};

export default NotificationGroupNotification;
