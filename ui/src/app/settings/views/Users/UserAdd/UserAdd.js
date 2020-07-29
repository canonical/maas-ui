import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";

import statusSelectors from "app/store/status/selectors";
import UserForm from "../UserForm";

export const UserAdd = () => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  if (externalAuthURL) {
    return (
      <Notification type="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }
  return <UserForm />;
};

export default UserAdd;
