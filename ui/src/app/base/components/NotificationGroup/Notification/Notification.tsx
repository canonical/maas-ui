import { Notification } from "@canonical/react-components";
import type { NotificationProps } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import settingsURLs from "app/settings/urls";
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
  className?: string | null;
  id: NotificationType["id"];
  severity: NotificationProps["severity"];
};

const NotificationGroupNotification = ({
  className,
  id,
  severity,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAdmin = useSelector(authSelectors.isAdmin);
  const notification = useSelector((state: RootState) =>
    notificationSelectors.getById(state, id)
  );
  if (!notification) {
    return null;
  }
  const showSettings = isReleaseNotification(notification) && isAdmin;
  const showDate = isUpgradeNotification(notification);
  return (
    <Notification
      actions={
        showSettings
          ? [
              {
                label: "See settings",
                onClick: () => {
                  history.push({
                    pathname: settingsURLs.configuration.general,
                  });
                },
              },
            ]
          : null
      }
      className={className}
      onDismiss={
        notification.dismissable
          ? () => dispatch(notificationActions.dismiss(id))
          : null
      }
      severity={severity}
      timestamp={showDate ? notification.created : null}
    >
      <span
        data-test="notification-message"
        dangerouslySetInnerHTML={{ __html: notification.message }}
      ></span>
    </Notification>
  );
};

export default NotificationGroupNotification;
