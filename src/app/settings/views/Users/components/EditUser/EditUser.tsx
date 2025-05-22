import type { ReactElement } from "react";
import { useState } from "react";

import { Button, Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import { useGetUser, useUpdateUser } from "@/app/api/query/users";
import type { CreateUserError, UserRequest } from "@/app/apiclient";
import { getUserQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { Labels } from "@/app/base/components/UserForm/UserForm";

type EditUserProps = {
  id: number;
  closeForm: () => void;
};

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email address")
    .required("Email is required"),
  fullName: Yup.string(),
  is_superuser: Yup.boolean(),
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

const EditUser = ({ id, closeForm }: EditUserProps): ReactElement => {
  const queryClient = useQueryClient();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const user = useGetUser({ path: { user_id: id } });
  const updateUser = useUpdateUser();

  return (
    <>
      {user.isPending && <Spinner text="Loading..." />}
      {user.isError && (
        <Notification data-testid="no-such-pool-error" severity="negative">
          User with id {id} does not exist.
        </Notification>
      )}
      {user.isSuccess && user.data && (
        <FormikForm<
          UserRequest & { passwordConfirm: UserRequest["password"] },
          CreateUserError
        >
          aria-label="Edit user"
          errors={updateUser.error}
          initialValues={{
            username: user.data.username,
            password: "",
            passwordConfirm: "",
            is_superuser: user.data.is_superuser,
            first_name: user.data.first_name,
            last_name: user.data.last_name || "",
            email: user.data.email,
          }}
          onCancel={closeForm}
          onSubmit={(values) => {
            if (values.password && values.passwordConfirm) {
              updateUser.mutate({
                path: { user_id: id },
                body: {
                  username: values.username,
                  password: values.password,
                  is_superuser: values.is_superuser,
                  first_name: values.first_name,
                  last_name: values.last_name,
                  email: values.email,
                } as UserRequest,
              });
            } else {
              updateUser.mutate({
                path: { user_id: id },
                body: {
                  username: values.username,
                  password: user.data?.password, // if not changed, use the fetched password
                  is_superuser: values.is_superuser,
                  first_name: values.first_name,
                  last_name: values.last_name,
                  email: values.email,
                } as UserRequest,
              });
            }
          }}
          onSuccess={() => {
            queryClient
              .invalidateQueries({
                queryKey: getUserQueryKey({
                  path: { user_id: id },
                }),
              })
              .then(closeForm);
          }}
          resetOnSave={true}
          saved={updateUser.isSuccess}
          saving={updateUser.isPending}
          submitLabel="Save user"
          validationSchema={UserSchema}
        >
          <FormikField
            autoComplete="username"
            help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
            label={Labels.Username}
            name="username"
            required={true}
            type="text"
          />
          <FormikField label={Labels.FullName} name="last_name" type="text" />
          <FormikField
            label={Labels.Email}
            name="email"
            required={true}
            type="email"
          />
          <FormikField
            label={Labels.MaasAdmin}
            name="is_superuser"
            type="checkbox"
          />
          {!passwordVisible && (
            <div className="u-sv2">
              <Button
                appearance="link"
                className="u-no-margin--bottom"
                data-testid="toggle-passwords"
                onClick={() => {
                  setPasswordVisible(!passwordVisible);
                }}
                type="button"
              >
                {Labels.ChangePassword}
              </Button>
            </div>
          )}
          {passwordVisible && (
            <>
              <FormikField
                autoComplete="new-password"
                label={Labels.Password}
                name="password"
                required={true}
                type="password"
              />
              <FormikField
                autoComplete="new-password"
                help="Enter the same password as before, for verification"
                label={Labels.PasswordAgain}
                name="passwordConfirm"
                required={true}
                type="password"
              />
            </>
          )}
        </FormikForm>
      )}
    </>
  );
};

export default EditUser;
