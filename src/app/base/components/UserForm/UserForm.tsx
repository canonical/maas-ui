import { useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import type { Props as FormikFormProps } from "@/app/base/components/FormikForm/FormikForm";
import authSelectors from "@/app/store/auth/selectors";
import statusSelectors from "@/app/store/status/selectors";
import userSelectors from "@/app/store/user/selectors";
import type { User } from "@/app/store/user/types";

export enum Labels {
  Username = "Username",
  FullName = "Full name (optional)",
  Email = "Email address",
  MaasAdmin = "MAAS administrator",
  ChangePassword = "Change password…",
  CurrentPassword = "Current password",
  Password = "Password",
  PasswordAgain = "Password (again)",
  NewPassword = "New password",
  NewPasswordAgain = "New password (again)",
}

export type UserValues = {
  isSuperuser: User["is_superuser"];
  email: User["email"];
  fullName: User["last_name"];
  old_password?: string;
  password?: string;
  passwordConfirm?: string;
  username: User["username"];
};

export type Props = {
  includeCurrentPassword?: boolean;
  includeUserType?: boolean;
  onSave: (values: UserValues) => void;
  onUpdateFields?: (values: UserValues) => void;
  user?: User | null;
} & Partial<FormikFormProps<UserValues>>;

const schemaFields = {
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
};

const UserSchema = Yup.object().shape({
  ...schemaFields,
  password: schemaFields.password.required("Password is required"),
  passwordConfirm: schemaFields.passwordConfirm.required(
    "Password is required"
  ),
});

const CurrentPasswordUserSchema = Yup.object().shape({
  ...schemaFields,
  old_password: Yup.string().required("Your current password is required"),
  password: schemaFields.password.required("A new password is required"),
  passwordConfirm: schemaFields.passwordConfirm.required(
    "Confirm your new password"
  ),
});

const NoPasswordUserSchema = Yup.object().shape(schemaFields);

export const UserForm = ({
  includeCurrentPassword,
  includeUserType,
  onSave,
  onUpdateFields,
  user,
  ...formProps
}: Props): React.ReactElement => {
  const editing = !!user;
  const [passwordVisible, setPasswordVisible] = useState(!editing);
  const saving = useSelector(userSelectors.saving);
  const saved = useSelector(userSelectors.saved);
  const userErrors = useSelector(userSelectors.errors);
  const authErrors = useSelector(authSelectors.errors);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const formDisabled = !!externalAuthURL;
  let errors = userErrors;
  if (includeCurrentPassword) {
    errors = {
      ...(authErrors && typeof authErrors === "object" ? authErrors : {}),
      ...(userErrors && typeof userErrors === "object" ? userErrors : {}),
    };
    // If there are no errors then make this a falsey value to prevent false positives.
    if (Object.keys(errors).length === 0) {
      errors = null;
    }
  }
  const initialValues: UserValues = {
    isSuperuser: user ? user.is_superuser : false,
    email: user ? user.email : "",
    // first_name is not exposed by the websocket, so only last_name is used.
    // https://bugs.launchpad.net/maas/+bug/1853579
    fullName: user ? user.last_name : "",
    password: "",
    passwordConfirm: "",
    username: user ? user.username : "",
  };
  if (includeCurrentPassword) {
    initialValues.old_password = "";
  }
  const fullSchema = includeCurrentPassword
    ? CurrentPasswordUserSchema
    : UserSchema;
  return (
    <FormikForm<UserValues>
      enableReinitialize
      errors={errors}
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        onSave(values);
        resetForm({ values });
      }}
      onSuccess={() => {
        setPasswordVisible(false);
      }}
      onValuesChanged={(values) => {
        onUpdateFields && onUpdateFields(values);
      }}
      resetOnSave
      saved={saved}
      saving={saving}
      validationSchema={
        editing && !passwordVisible ? NoPasswordUserSchema : fullSchema
      }
      {...formProps}
    >
      <FormikField
        autoComplete="username"
        disabled={formDisabled}
        help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        label={Labels.Username}
        name="username"
        required={true}
        type="text"
      />
      <FormikField
        disabled={formDisabled}
        label={Labels.FullName}
        name="fullName"
        type="text"
      />
      <FormikField
        disabled={formDisabled}
        label={Labels.Email}
        name="email"
        required={true}
        type="email"
      />
      {includeUserType && (
        <FormikField
          disabled={formDisabled}
          label={Labels.MaasAdmin}
          name="isSuperuser"
          type="checkbox"
        />
      )}
      {editing && !passwordVisible && (
        <div className="u-sv2">
          <Button
            appearance="link"
            className="u-no-margin--bottom"
            data-testid="toggle-passwords"
            onClick={() => setPasswordVisible(!passwordVisible)}
            type="button"
          >
            {Labels.ChangePassword}
          </Button>
        </div>
      )}
      {passwordVisible && (
        <>
          {includeCurrentPassword && (
            <FormikField
              autoComplete="current-password"
              disabled={formDisabled}
              label={Labels.CurrentPassword}
              name="old_password"
              required={true}
              type="password"
            />
          )}
          <FormikField
            autoComplete="new-password"
            disabled={formDisabled}
            label={
              includeCurrentPassword ? Labels.NewPassword : Labels.Password
            }
            name="password"
            required={true}
            type="password"
          />
          <FormikField
            autoComplete="new-password"
            disabled={formDisabled}
            help="Enter the same password as before, for verification"
            label={
              includeCurrentPassword
                ? Labels.NewPasswordAgain
                : Labels.PasswordAgain
            }
            name="passwordConfirm"
            required={true}
            type="password"
          />
        </>
      )}
    </FormikForm>
  );
};

export default UserForm;
