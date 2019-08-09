import { useSelector } from "react-redux";
import React from "react";

import { useFetchOnce, useParams } from "app/base/hooks";
import actions from "app/settings/actions";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";
import UserForm from "app/settings/components/UserForm";

export const UserEdit = () => {
  const { id } = useParams();
  const loading = useSelector(selectors.users.loading);
  const user = useSelector(state =>
    selectors.users.getById(state, parseInt(id))
  );
  useFetchOnce(actions.users.fetch, selectors.users.loaded);
  if (loading) {
    return <Loader text="Loading..." />;
  }
  if (!user) {
    return <h4>User not found</h4>;
  }
  return <UserForm title="Edit user" user={user} />;
};

export default UserEdit;
