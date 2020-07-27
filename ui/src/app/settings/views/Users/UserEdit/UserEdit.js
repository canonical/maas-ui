import { Spinner } from "@canonical/react-components";
import { Notification } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import statusSelectors from "app/store/status/selectors";
import userSelectors from "app/store/user/selectors";
import { user as userActions } from "app/base/actions";
import UserForm from "../UserForm";

export const UserEdit = () => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.fetch());
  }, [dispatch]);

  const { id } = useParams();
  const loading = useSelector(userSelectors.loading);
  const user = useSelector((state) =>
    userSelectors.getById(state, parseInt(id))
  );

  if (externalAuthURL) {
    return (
      <Notification type="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }
  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!user) {
    return <h4>User not found</h4>;
  }
  return <UserForm user={user} />;
};

export default UserEdit;
