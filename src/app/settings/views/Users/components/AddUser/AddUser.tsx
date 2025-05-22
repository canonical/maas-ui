import type { ReactElement } from "react";
import { useState } from "react";

import { Button } from "@canonical/react-components";
import * as Yup from "yup";

import { useCreateUser } from "@/app/api/query/users";
import type { CreateUserError, UserRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { Labels } from "@/app/base/components/UserForm/UserForm";

type AddUserProps = {
  closeForm: () => void;
};

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email address")
    .required("Email is required"),
  fullName: Yup.string(),
  is_superuser: Yup.boolean(),
  password: Yup.string().required("Password is required"),
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

const AddUser = ({ closeForm }: AddUserProps): ReactElement => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const createUser = useCreateUser();

  return (
    <FormikForm<UserRequest, CreateUserError>
      aria-label="Add user"
      errors={createUser.error}
      initialValues={{
        username: "",
        password: "",
        is_superuser: false,
        first_name: "",
        last_name: "",
        email: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createUser.mutate({
          body: {
            username: values.username,
            password: values.password,
            is_superuser: values.is_superuser,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
          } as UserRequest,
        });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={createUser.isSuccess}
      saving={createUser.isPending}
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
  );
};

export default AddUser;
