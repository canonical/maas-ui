import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { useParams } from "app/base/hooks";
import { user as userActions } from "app/base/actions";
import { user as userSelectors } from "app/base/selectors";
import UserForm from "../UserForm";

export const UserEdit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.fetch());
  }, [dispatch]);

  const { id } = useParams();
  const loading = useSelector(userSelectors.loading);
  const user = useSelector(state => userSelectors.getById(state, parseInt(id)));
  if (loading) {
    return <Loader text="Loading..." />;
  }
  if (!user) {
    return <h4>User not found</h4>;
  }
  return <UserForm user={user} />;
};

export default UserEdit;
