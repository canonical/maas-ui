import { useEffect } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import UserForm from "../UserForm";

import { useGetURLId } from "app/base/hooks/urls";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import statusSelectors from "app/store/status/selectors";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";

export const UserEdit = (): JSX.Element => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.fetch());
  }, [dispatch]);

  const id = useGetURLId(PodMeta.PK);
  const loading = useSelector(userSelectors.loading);
  const user = useSelector((state: RootState) =>
    userSelectors.getById(state, id)
  );

  if (externalAuthURL) {
    return (
      <Notification severity="information">
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
