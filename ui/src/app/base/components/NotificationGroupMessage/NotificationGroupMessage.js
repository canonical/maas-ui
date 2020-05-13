import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@canonical/react-components";

const NotificationGroupMessage = ({ message, id, action, actionHandler }) => {
  const dispatch = useDispatch();
  return (
    <div className="p-notification__response u-no-max-width">
      <ul className="p-inline-list u-no-margin--bottom">
        <li className="p-inline-list__item">
          <span
            data-test="notification-message"
            dangerouslySetInnerHTML={{ __html: message }}
          ></span>
        </li>
        {action && (
          <li className="p-inline-list__item">
            <Button
              appearance="link"
              data-test="action-link"
              className="p-notification__action"
              onClick={() => actionHandler(id, dispatch)}
            >
              {action}
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
};

NotificationGroupMessage.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.number,
  action: PropTypes.string,
  actionHandler: PropTypes.func,
};

export default NotificationGroupMessage;
