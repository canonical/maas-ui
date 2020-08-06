import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "@canonical/react-components";
import { Link } from "react-router-dom";

import { isReleaseNotification } from "app/store/utils";
import { MessageType } from "app/store/message/types";
import { notification as notificationActions } from "app/base/actions";
import authSelectors from "app/store/auth/selectors";
import ContextualMenu from "app/base/components/ContextualMenu";
import notificationSelectors from "app/store/notification/selectors";
import Switch from "app/base/components/Switch";
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
  const showMenu =
    isReleaseNotification(notification) && authUser?.is_superuser;
  return (
    <Notification
      className={showMenu ? "p-notification--has-menu" : null}
      close={
        notification.dismissable
          ? () => dispatch(notificationActions.delete(id))
          : null
      }
      type={type}
    >
      <span
        data-test="notification-message"
        dangerouslySetInnerHTML={{ __html: notification.message }}
      ></span>
      {showMenu && (
        <ContextualMenu
          className="p-notification__menu-button"
          dropdownClassName="p-notification__menu"
          dropdownContent={
            <>
              <div className="u-flex--between">
                <div className="u-sv1">Enable new release notifications</div>
                <Switch disabled={true} checked={true} />
              </div>
              <Link to="/settings/configuration/general">See settings</Link>
            </>
          }
          hasToggleIcon
          position="right"
          toggleAppearance="base"
        />
      )}
    </Notification>
  );
};

NotificationGroupNotification.propTypes = {
  id: PropTypes.number,
  type: PropTypes.oneOf(["caution", "negative", "positive", "information"])
    .isRequired,
};

export default NotificationGroupNotification;
