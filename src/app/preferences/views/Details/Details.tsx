import { useState } from "react";

import { Col, Notification, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import UserForm from "app/base/components/UserForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import { actions as authActions } from "app/store/auth";
import authSelectors from "app/store/auth/selectors";
import statusSelectors from "app/store/status/selectors";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";

export const Details = (): JSX.Element => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const usersSaved = useSelector(userSelectors.saved);
  const authUserSaved = useSelector(authSelectors.saved);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const cleanup = () => {
    dispatch(authActions.cleanup());
    return userActions.cleanup();
  };

  useWindowTitle("Details");

  useAddMessage(
    usersSaved && (!passwordChanged || authUserSaved),
    cleanup,
    "Your details were updated successfully"
  );

  return (
    <>
      {externalAuthURL && (
        <Notification severity="information">
          Users for this MAAS are managed using an external service
        </Notification>
      )}
      <Row>
        <Col size={4}>
          <UserForm
            buttonsAlign="left"
            buttonsBordered={false}
            cleanup={cleanup}
            includeCurrentPassword
            includeUserType={false}
            onSaveAnalytics={{
              action: "Saved",
              category: "Details preferences",
              label: "Details form",
            }}
            onSave={(values) => {
              if (authUser) {
                dispatch(
                  userActions.update({
                    id: authUser.id,
                    email: values.email,
                    is_superuser: values.isSuperuser,
                    last_name: values.fullName,
                    username: values.username,
                  })
                );
              }
              const passwordChanged =
                !!values.old_password ||
                !!values.password ||
                !!values.passwordConfirm;
              if (passwordChanged) {
                dispatch(
                  authActions.changePassword({
                    old_password: values.old_password,
                    new_password1: values.password,
                    new_password2: values.passwordConfirm,
                  })
                );
              }
              setPasswordChanged(passwordChanged);
            }}
            user={authUser}
          />
        </Col>
      </Row>
    </>
  );
};

export default Details;
