import { Notification } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import authSelectors from "app/store/auth/selectors";
import type { MessageType } from "app/store/message/types";
import { actions as notificationActions } from "app/store/notification";
import notificationSelectors from "app/store/notification/selectors";
import type { Notification as NotificationType } from "app/store/notification/types";
import type { RootState } from "app/store/root/types";
import { isReleaseNotification } from "app/store/utils";

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
    </Notification>
  );
};

NotificationGroupNotification.propTypes = {
  id: PropTypes.number,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired,
};

export default NotificationGroupNotification;
