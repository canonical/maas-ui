import { Notification } from "@canonical/react-components";
import type { NotificationProps } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import settingsURLs from "@/app/settings/urls";
import authSelectors from "@/app/store/auth/selectors";
import { notificationActions } from "@/app/store/notification";
import notificationSelectors from "@/app/store/notification/selectors";
import type { Notification as NotificationType } from "@/app/store/notification/types";
import {
  isReleaseNotification,
  isUpgradeNotification,
} from "@/app/store/notification/utils";
import type { RootState } from "@/app/store/root/types";
import { formatUtcDatetime } from "@/app/utils/time";

type Props = {
  className?: string | null;
  id: NotificationType["id"];
  severity: NotificationProps["severity"];
};

const NotificationGroupNotification = ({
  className,
  id,
  severity,
}: Props): React.ReactElement | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector(authSelectors.isAdmin);
  const notification = useSelector((state: RootState) =>
    notificationSelectors.getById(state, id)
  );
  const createdTimestamp = formatUtcDatetime(notification?.created);
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
                  navigate({
                    pathname: settingsURLs.configuration.general,
                  });
                },
              },
            ]
          : undefined
      }
      className={className}
      onDismiss={
        notification.dismissable
          ? () => dispatch(notificationActions.dismiss(id))
          : undefined
      }
      severity={severity}
      timestamp={showDate ? createdTimestamp : null}
    >
      <span
        dangerouslySetInnerHTML={{ __html: notification.message }}
        data-testid="notification-message"
      ></span>
    </Notification>
  );
};

export default NotificationGroupNotification;
