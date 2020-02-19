import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@canonical/react-components";

const NotificationGroupMessage = ({ message, id, action, actionHandler }) => {
  const dispatch = useDispatch();
  return (
    <p className="p-notification__response">
      <span
        className="p-notification__status"
        data-test="notification-message"
        dangerouslySetInnerHTML={{ __html: message }}
      ></span>
      {action && (
        <Button
          appearance="link"
          data-test="action-link"
          className="p-notification__action"
          onClick={() => actionHandler(id, dispatch)}
        >
          {action}
        </Button>
      )}
    </p>
  );
};

NotificationGroupMessage.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.number,
  action: PropTypes.string,
  actionHandler: PropTypes.func
};

export default NotificationGroupMessage;
