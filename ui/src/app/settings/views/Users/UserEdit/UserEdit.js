import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { useParams } from "app/base/hooks";
import actions from "app/settings/actions";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";
import UserForm from "../UserForm";

export const UserEdit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.users.fetch());
  }, [dispatch]);

  const { id } = useParams();
  const loading = useSelector(selectors.users.loading);
  const user = useSelector(state =>
    selectors.users.getById(state, parseInt(id))
  );
  if (loading) {
    return <Loader text="Loading..." />;
  }
  if (!user) {
    return <h4>User not found</h4>;
  }
  return <UserForm title="Edit user" user={user} />;
};

export default UserEdit;
