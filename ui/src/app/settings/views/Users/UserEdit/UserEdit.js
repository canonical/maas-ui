import { Spinner } from "@canonical/react-components";
import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import {
  status as statusSelectors,
  user as userSelectors,
} from "app/base/selectors";
import { useParams } from "app/base/hooks";
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
