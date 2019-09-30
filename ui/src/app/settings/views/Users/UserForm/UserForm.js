import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { user as userActions } from "app/base/actions";
import { user as userSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import { UserShape } from "app/base/proptypes";
import FormCard from "app/base/components/FormCard";
import BaseUserForm from "app/base/components/UserForm";

export const UserForm = ({ user }) => {
  const dispatch = useDispatch();
  const saved = useSelector(userSelectors.saved);
  const [savingUser, setSaving] = useState();
  const [name, setName] = useState();
  const editing = !!user;

  useAddMessage(
    saved,
    userActions.cleanup,
    `${savingUser} ${editing ? "updated" : "added"} successfully.`,
    setSaving
  );
  const title = editing ? <>Editing `{name}`</> : "Add user";

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(userActions.cleanup());
    };
  }, [dispatch]);

  if (saved) {
    // The user was successfully created/updated so redirect to the user list.
    return <Redirect to="/settings/users" />;
  }

  return (
    <FormCard title={title}>
      <BaseUserForm
        onSave={(params, values, editing) => {
          if (editing) {
            dispatch(userActions.update(params));
          } else {
            dispatch(userActions.create(params));
          }
          setSaving(values.username);
        }}
        onUpdateFields={formikProps => {
          setName(formikProps.values.username);
        }}
        user={user}
      />
    </FormCard>
  );
};

UserForm.propTypes = {
  user: UserShape
};

export default UserForm;
