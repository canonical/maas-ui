import type { ReactElement } from "react";
import { useState } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import {
  Button,
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import { Labels } from "../../constants";
import GroupMultiSelect from "../GroupMultiSelect";

import { useGetCurrentUser, useUpdateMe } from "@/app/api/query/auth";
import { useGetUser, useUpdateUser } from "@/app/api/query/users";
import type {
  UpdateUserError,
  UpdateUserMeError,
  UserUpdateRequestAdmin,
  UserUpdateRequestSelf,
} from "@/app/apiclient";
import {
  getUserInfoQueryKey,
  getUserQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type EditUserProps = {
  id: number;
  isSelfEditing?: boolean;
};

type EditUserValues = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: number[];
  oldPassword: string;
  password: string;
  passwordConfirm: string;
};

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email address")
    .required("Email is required"),
  groups: Yup.array().of(Yup.number().required()),
  password: Yup.string(),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must be the same"
  ),
  username: Yup.string()
    .max(150, "Username must be 150 characters or less")
    .matches(
      /^[a-zA-Z 0-9@.+-_]*$/,
      "Usernames must contain letters, digits and @/./+/-/_ only"
    )
    .required("Username is required"),
});

const newPasswordFields = {
  password: Yup.string().required("A new password is required"),
  passwordConfirm: Yup.string()
    .required("Confirm your new password")
    .oneOf([Yup.ref("password")], "Passwords must be the same"),
};

const EditUserSchema = UserSchema.shape(newPasswordFields);

const SelfEditUserSchema = UserSchema.shape({
  ...newPasswordFields,
  oldPassword: Yup.string().required("Your current password is required"),
});

const EditUser = ({
  id,
  isSelfEditing = false,
}: EditUserProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Self-editing users fetch their own profile via `/users/me`, while admins
  // editing another user fetch it via `/users/{id}`.
  const currentUser = useGetCurrentUser();
  const otherUser = useGetUser({ path: { user_id: id } }, !isSelfEditing);
  const user = isSelfEditing ? currentUser : otherUser;
  const userLoading = isSelfEditing
    ? currentUser.isLoading
    : otherUser.isPending;
  const eTag = user.data?.headers?.get("ETag");
  const updateUser = useUpdateUser();
  const updateMe = useUpdateMe();

  return (
    <>
      {userLoading && <Spinner text="Loading..." />}
      {user.isError && (
        <NotificationBanner severity="negative">
          {user.error?.message}
        </NotificationBanner>
      )}
      {user.isSuccess && user.data && (
        <FormikForm<EditUserValues, UpdateUserError | UpdateUserMeError>
          aria-label={isSelfEditing ? "Edit your profile" : "Edit user"}
          errors={isSelfEditing ? updateMe.error : updateUser.error}
          initialValues={{
            username: user.data.username,
            password: "",
            passwordConfirm: "",
            oldPassword: "",
            groups: user.data.groups.map((group) => group.id),
            first_name: user.data.first_name,
            last_name: user.data.last_name || "",
            email: user.data.email || "",
          }}
          onCancel={closeSidePanel}
          onSubmit={(values) => {
            const isChangingPassword = passwordVisible && !!values.password;

            if (isSelfEditing) {
              // Users can always edit their own profile. The API verifies the
              // current password when a new one is supplied.
              const body: UserUpdateRequestSelf = {
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
              };
              if (isChangingPassword) {
                body.current_password = values.oldPassword;
                body.new_password = values.password;
              }
              updateMe.mutate({ body });
            } else {
              // Admins editing another user must supply the user's groups
              const body: UserUpdateRequestAdmin = {
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                groups: values.groups,
              };
              if (isChangingPassword) {
                body.password = values.password;
              }
              updateUser.mutate({
                headers: { ETag: eTag },
                path: { user_id: id },
                body,
              });
            }
          }}
          onSuccess={() => {
            return queryClient
              .invalidateQueries({
                queryKey: isSelfEditing
                  ? getUserInfoQueryKey()
                  : getUserQueryKey({
                      path: { user_id: id },
                    }),
              })
              .then(closeSidePanel);
          }}
          resetOnSave={true}
          saved={isSelfEditing ? updateMe.isSuccess : updateUser.isSuccess}
          saving={isSelfEditing ? updateMe.isPending : updateUser.isPending}
          submitLabel={isSelfEditing ? "Save profile" : "Save user"}
          validationSchema={
            passwordVisible
              ? isSelfEditing
                ? SelfEditUserSchema
                : EditUserSchema
              : UserSchema
          }
        >
          {() => (
            <>
              <FormikField
                autoComplete="username"
                help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
                label={Labels.Username}
                name="username"
                required={true}
                type="text"
              />
              <FormikField
                label={Labels.FullName}
                name="last_name"
                type="text"
              />
              <FormikField
                label={Labels.Email}
                name="email"
                required={true}
                type="email"
              />
              {!isSelfEditing && (
                <GroupMultiSelect
                  help="Select authorization groups for this user"
                  name="groups"
                />
              )}
              {!passwordVisible && (
                <div className="u-sv2">
                  <Button
                    appearance="link"
                    className="u-no-margin--bottom"
                    onClick={() => {
                      setPasswordVisible(true);
                    }}
                    type="button"
                  >
                    {Labels.ChangePassword}
                  </Button>
                </div>
              )}
              {passwordVisible && (
                <>
                  {isSelfEditing && (
                    <FormikField
                      autoComplete="current-password"
                      label={Labels.CurrentPassword}
                      name="oldPassword"
                      required={true}
                      type="password"
                    />
                  )}
                  <FormikField
                    autoComplete="new-password"
                    label={isSelfEditing ? Labels.NewPassword : Labels.Password}
                    name="password"
                    required={true}
                    type="password"
                  />
                  <FormikField
                    autoComplete="new-password"
                    help="Enter the same password as before, for verification"
                    label={
                      isSelfEditing
                        ? Labels.NewPasswordAgain
                        : Labels.PasswordAgain
                    }
                    name="passwordConfirm"
                    required={true}
                    type="password"
                  />
                </>
              )}
            </>
          )}
        </FormikForm>
      )}
    </>
  );
};

export default EditUser;
