import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import BaseUserForm from "@/app/base/components/UserForm";
import type { Props as UserFormProps } from "@/app/base/components/UserForm/UserForm";
import { useAddMessage } from "@/app/base/hooks";
import settingsURLs from "@/app/settings/urls";
import { authActions } from "@/app/store/auth";
import { userActions } from "@/app/store/user";
import userSelectors from "@/app/store/user/selectors";
import type { User } from "@/app/store/user/types";

export enum Labels {
  Save = "Save user",
}

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

  useAddMessage(
    saved,
    userActions.cleanup,
    `${savingUser} ${editing ? "updated" : "added"} successfully.`,
    () => setSaving(null)
  );

  return (
    <BaseUserForm
      aria-label={title}
      cleanup={userActions.cleanup}
      includeUserType
      onCancel={() => navigate(-1)}
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
      onSaveAnalytics={{
        action: "Saved",
        category: "Users settings",
        label: `${editing ? "Edit" : "Add"} user form`,
      }}
      onUpdateFields={(values) => {
        setName(values.username);
      }}
      savedRedirect={settingsURLs.users.index}
      submitLabel="Save user"
      user={user}
    />
  );
};

export default UserForm;
