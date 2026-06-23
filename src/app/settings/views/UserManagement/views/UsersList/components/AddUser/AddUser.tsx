import type { ReactElement } from "react";
import { useMemo } from "react";

import type { FormikContextType } from "formik";
import * as Yup from "yup";

import { useGroups } from "@/app/api/query/groups";
import { useCreateUser } from "@/app/api/query/users";
import type { CreateUserError, UserCreateRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import TagSelector from "@/app/base/components/TagSelector";
import type { Tag } from "@/app/base/components/TagSelector/TagSelector";
import { useSidePanel } from "@/app/base/side-panel-context";
import { Labels } from "@/app/settings/views/UserManagement/views/UsersList/constants";

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email address")
    .required("Email is required"),
  fullName: Yup.string(),
  groups: Yup.array().of(Yup.number().required()),
  password: Yup.string().required("Password is required"),
  passwordConfirm: Yup.string()
    .required("Password re-entry is required")
    .oneOf([Yup.ref("password")], "Passwords must be the same"),
  username: Yup.string()
    .max(150, "Username must be 150 characters or less")
    .matches(
      /^[a-zA-Z 0-9@.+-_]*$/,
      "Usernames must contain letters, digits and @/./+/-/_ only"
    )
    .required("Username is required"),
});

const AddUser = (): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const createUser = useCreateUser();

  const { data: groups } = useGroups();

  const groupTags = useMemo(
    (): Tag[] =>
      groups?.items.map((group) => ({
        id: group.id,
        name: group.name,
        description:
          typeof group.description === "string" ? group.description : undefined,
      })) ?? [],
    [groups]
  );

  return (
    <FormikForm<UserCreateRequest, CreateUserError>
      aria-label="Add user"
      errors={createUser.error}
      initialValues={{
        username: "",
        password: "",
        passwordConfirm: "",
        groups: [],
        first_name: "",
        last_name: "",
        email: "",
      }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        createUser.mutate({
          body: {
            username: values.username,
            password: values.password,
            groups: values.groups,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
          } as UserCreateRequest,
        });
      }}
      onSuccess={closeSidePanel}
      resetOnSave={true}
      saved={createUser.isSuccess}
      saving={createUser.isPending}
      submitLabel="Save user"
      validationSchema={UserSchema}
    >
      {({ setFieldValue }: FormikContextType<UserCreateRequest>) => (
        <>
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
            component={TagSelector}
            help="Select authorization groups for this user."
            label="Groups"
            name="groups"
            onTagsUpdate={(selectedGroups: Tag[]) => {
              setFieldValue(
                "groups",
                selectedGroups.map((group) => group.id)
              ).catch((reason: unknown) => {
                throw new FormikFieldChangeError(
                  "groups",
                  "setFieldValue",
                  reason as string
                );
              });
            }}
            placeholder="Select groups"
            tags={groupTags}
          />
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
