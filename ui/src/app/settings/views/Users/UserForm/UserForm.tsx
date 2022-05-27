import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";

import FormCard from "app/base/components/FormCard";
import BaseUserForm from "app/base/components/UserForm";
import type { Props as UserFormProps } from "app/base/components/UserForm/UserForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import settingsURLs from "app/settings/urls";
import { actions as authActions } from "app/store/auth";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";
import type { User } from "app/store/user/types";

type PropTypes = {
  user?: UserFormProps["user"];
};

export const UserForm = ({ user }: PropTypes): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector(userSelectors.saved);
  const [savingUser, setSaving] = useState<User["username"] | null>(null);
  const [name, setName] = useState<User["username"] | null>(null);
  const editing = !!user;
  const title = editing ? `Editing \`${name}\`` : "Add user";

  useWindowTitle(title);

  useAddMessage(
    saved,
    userActions.cleanup,
    `${savingUser} ${editing ? "updated" : "added"} successfully.`,
    () => setSaving(null)
  );

  return (
    <FormCard title={title}>
      <BaseUserForm
        buttonsAlign="right"
        buttonsBordered
        cleanup={userActions.cleanup}
        includeUserType
        submitLabel="Save user"
        onCancel={() => navigate(-1)}
        onSaveAnalytics={{
          action: "Saved",
          category: "Users settings",
          label: `${editing ? "Edit" : "Add"} user form`,
        }}
        onSave={(values) => {
          const params = {
            email: values.email,
            is_superuser: values.isSuperuser,
            last_name: values.fullName,
            username: values.username,
          };
          if (editing && user) {
            dispatch(userActions.update({ ...params, id: user.id }));
            if (values.password && values.passwordConfirm) {
              dispatch(
                authActions.adminChangePassword({
                  ...params,
                  id: user.id,
                  password1: values.password,
                  password2: values.passwordConfirm,
                })
              );
            }
          } else if (!editing && values.password && values.passwordConfirm) {
            dispatch(
              userActions.create({
                ...params,
                password1: values.password,
                password2: values.passwordConfirm,
              })
            );
          }
          setSaving(values.username);
        }}
        onUpdateFields={(values) => {
          setName(values.username);
        }}
        savedRedirect={settingsURLs.users.index}
        user={user}
      />
    </FormCard>
  );
};

export default UserForm;
