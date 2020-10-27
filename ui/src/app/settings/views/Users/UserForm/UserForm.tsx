import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";

import { auth as authActions } from "app/base/actions";
import { actions as userActions } from "app/store/user";
import type { User } from "app/store/user/types";
import userSelectors from "app/store/user/selectors";
import { useAddMessage } from "app/base/hooks";
import { UserShape } from "app/base/proptypes";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import BaseUserForm from "app/base/components/UserForm";
import FormCardButtons from "app/base/components/FormCardButtons";

type UserWithPassword = User & {
  password1: string;
  password2: string;
};

type PropTypes = {
  user: UserWithPassword;
};

export const UserForm = ({ user }: PropTypes): JSX.Element => {
  const dispatch = useDispatch();
  const saved = useSelector(userSelectors.saved);
  const [savingUser, setSaving] = useState();
  const [name, setName] = useState();
  const editing = !!user;
  const title = editing ? `Editing \`${name}\`` : "Add user";

  useWindowTitle(title);

  useAddMessage(
    saved,
    userActions.cleanup,
    `${savingUser} ${editing ? "updated" : "added"} successfully.`,
    setSaving
  );

  return (
    <FormCard title={title}>
      <BaseUserForm
        buttons={FormCardButtons}
        cleanup={userActions.cleanup}
        includeUserType
        submitLabel="Save user"
        onSaveAnalytics={{
          action: "Saved",
          category: "Users settings",
          label: `${editing ? "Edit" : "Add"} user form`,
        }}
        onSave={(params, values, editing) => {
          if (editing) {
            dispatch(userActions.update(params));
            if (values.password && values.passwordConfirm) {
              dispatch(authActions.adminChangePassword(params));
            }
          } else {
            dispatch(userActions.create(params));
          }
          setSaving(values.username);
        }}
        onUpdateFields={(values) => {
          setName(values.username);
        }}
        savedRedirect="/settings/users"
        user={user}
      />
    </FormCard>
  );
};

UserForm.propTypes = {
  user: UserShape,
};

export default UserForm;
