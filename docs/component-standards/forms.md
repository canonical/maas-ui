# Form Component Standards

## TL;DR

- Use `FormikForm` for all forms, and extract field definitions into separate components or hooks for maintainability
- Use `ModelActionForm` for simple confirmation forms (e.g., delete, archive)
- Use Yup for validation schemas
- Always provide clear error, loading, and success states
- Write tests in separate `describe` blocks for display, validation, and actions

## Overview

We use [FormikForm](/src/app/base/components/FormikForm/FormikForm.tsx) for all forms, and [ModelActionForm](/src/app/base/components/ModelActionForm/ModelActionForm.tsx) for confirmation dialogs. These components provide a consistent, accessible, and feature-rich form experience.

## Common Patterns

### Basic Form Structure

Extract field definitions into their own components or hooks. Use Yup for validation. Example:

```tsx
const UserSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const AddUserForm = () => {
  const createUser = useCreateUser();
  return (
    <FormikForm
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={UserSchema}
      onSubmit={createUser.mutate}
      errors={createUser.error}
      saving={createUser.isPending}
      saved={createUser.isSuccess}
      submitLabel="Save user"
    >
      <FormikField name="username" label="Username" required />
      <FormikField name="email" label="Email" required />
      <FormikField name="password" label="Password" required type="password" />
    </FormikForm>
  );
};
```

### Confirmation Forms

Use `ModelActionForm` for simple confirmation dialogs:

```tsx
<ModelActionForm
  aria-label="Confirm user deletion"
  errors={deleteUser.error}
  modelType="user"
  initialValues={{}}
  onCancel={closeSidePanel}
  onSubmit={handleDelete}
  onSuccess={() =>
    queryClient.invalidateQueries({ queryKey: listUsersQueryKey() })
  }
  saved={deleteUser.isSuccess}
  saving={deleteUser.isPending}
  submitLabel="Delete user"
/>
```

### Validation

- Use Yup for all validation schemas
- Place schemas in the same file as the form or in a shared location if reused
- Always provide user-friendly error messages

### Error, Loading, and Success States

- Use the `errors`, `saving`, and `saved` props on `FormikForm` to display error, loading, and success states
- Show notifications or inline messages for errors and success

### Business Logic

- Use mutation/query hooks (e.g., `useCreateUser`, `useUpdateUser`) for API calls
- Pass mutation functions to `onSubmit`

## Testing Standards

Every form component should have comprehensive tests organized into separate `describe` blocks for different concerns.

### Test Structure

```tsx
describe("AddUserForm", () => {
  describe("display", () => {
    // Display-related tests
  });
  describe("validation", () => {
    // Validation tests
  });
  describe("actions", () => {
    // Action/interaction tests
  });
});
```

### Display Tests

- Test loading, error, and success states
- Test that all fields and buttons are rendered

### Validation Tests

- Test required fields and validation errors
- Test that invalid input shows correct error messages

### Action Tests

- Test submitting the form calls the correct mutation
- Test cancel buttons and side effects

## Best Practices

- Extract field definitions and validation schemas for maintainability
- Use mutation hooks for API calls
- Always provide clear error, loading, and success states
- Organize tests by display, validation, permissions, and actions
- Use `ModelActionForm` for confirmation dialogs
- Use Yup for validation
