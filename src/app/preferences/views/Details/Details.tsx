import { useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Col, Notification, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { useChangeThisUsersPassword } from "@/app/api/query/users";
import UserForm from "@/app/base/components/UserForm";
import { useWindowTitle } from "@/app/base/hooks";
import statusSelectors from "@/app/store/status/selectors";

export enum Label {
  Title = "Details",
}

export const Details = (): React.ReactElement => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const usersSaved = useSelector(userSelectors.saved);
  const authUserSaved = useSelector(authSelectors.saved);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const changePassword = useChangeThisUsersPassword();

  useWindowTitle(Label.Title);

  return (
    <ContentSection aria-label={Label.Title}>
      <ContentSection.Title>{Label.Title}</ContentSection.Title>
      <ContentSection.Content>
        {externalAuthURL && (
          <Notification severity="information">
            Users for this MAAS are managed using an external service
          </Notification>
        )}
        <Row>
          <Col size={6}>
            <UserForm
              includeCurrentPassword
              includeUserType={false}
              onSave={(values) => {
                if (authUser) {
                  changePassword.mutate({});
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
              onSaveAnalytics={{
                action: "Saved",
                category: "Details preferences",
                label: "Details form",
              }}
              user={authUser}
            />
          </Col>
        </Row>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default Details;
