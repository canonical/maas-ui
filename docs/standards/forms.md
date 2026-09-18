# Form Component Standards

## TL;DR

- Use `FormikForm` for all forms, and extract field definitions into separate components or hooks for maintainability
- Use `ModelActionForm` for simple confirmation forms (e.g., delete, archive)
- Use Yup for validation schemas
- Always provide clear error, loading, and success states
- Write tests in separate `describe` blocks for display, validation, and actions
- Open forms with fields (that aren't destructive) in a [side panel](side-panels.md); open fieldless confirmations and destructive forms in a [modal](modals.md)

## Overview

We use [FormikForm](/src/app/base/components/FormikForm/FormikForm.tsx) for all forms, and [ModelActionForm](/src/app/base/components/ModelActionForm/ModelActionForm.tsx) for confirmation dialogs. These components provide a consistent, accessible, and feature-rich form experience.

## Choosing a Side Panel or a Modal

A form is opened in one of two containers — a [side panel](side-panels.md) (`openSidePanel`) or a [modal](modals.md) (`openModal`). Use this to decide which:

| Container   | When to use                                                              |
| ----------- | ------------------------------------------------------------------------- |
| Side panel  | The form has input fields and the action is not destructive (add/edit forms) |
| Modal       | The form has no fields (a plain confirmation), **or** the action is destructive (delete, remove, release, etc.) |

In practice this means most `ModelActionForm` confirmations and any form built on `ActionForm` for a destructive `NodeAction` (e.g. delete) should open via `useModal`'s `openModal`, not `useSidePanel`'s `openSidePanel`. Non-destructive forms with fields — including non-destructive `ActionForm` confirmations that still take input — keep using the side panel.

Some components support being opened either way depending on context — see [`FieldlessForm`](/src/app/base/components/node/FieldlessForm/FieldlessForm.tsx), which reads `useSidePanel().isOpen` to decide whether `onCancel`/`onSuccess` should call `closeSidePanel` or `closeModal`. `ControllerListHeader` picks `openModal` vs `openSidePanel` up front, based on whether the action is in a list of actions that require confirmation:

```tsx
const openForm = ControllerActionConfirmations.some(
  (nodeAction) => nodeAction === action
)
  ? openModal
  : openSidePanel;

openForm({ component: ControllerActionFormWrapper, props: { ... }, title });
```

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

Use `ModelActionForm` for simple confirmation dialogs. These are fieldless and, in this example, destructive — so they're opened in a [modal](modals.md) and closed with `closeModal`, not `closeSidePanel`:

```tsx
const { closeModal } = useModal();

<ModelActionForm
  aria-label="Confirm user deletion"
  errors={deleteUser.error}
  modelType="user"
  initialValues={{}}
  onCancel={closeModal}
  onSubmit={handleDelete}
  onSuccess={() => {
    queryClient.invalidateQueries({ queryKey: listUsersQueryKey() });
    closeModal();
  }}
  saved={deleteUser.isSuccess}
  saving={deleteUser.isPending}
  submitLabel="Delete user"
/>
```

Unlike the side panel, the modal does not close itself on route change, so make sure `closeModal` is called explicitly in `onSuccess`.

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

## Closing the Side Panel on Success

After a successful mutation, close the side panel by passing `saved={mutation.isSuccess}` and `onSuccess={closeSidePanel}` to `FormikForm`. When `saved` becomes `true`, `FormikForm` calls `onSuccess` automatically.

```tsx
const AddPool = (): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const createPool = useCreatePool();

  return (
    <FormikForm<ResourcePoolRequest, CreateResourcePoolError>
      aria-label="Add pool"
      errors={createPool.error}
      initialValues={{ description: "", name: "" }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        createPool.mutate({ body: { name: values.name, description: values.description } });
      }}
      onSuccess={closeSidePanel}
      saved={createPool.isSuccess}
      saving={createPool.isPending}
      submitLabel="Save pool"
      validationSchema={PoolSchema}
    >
      <FormikField label="Name (required)" name="name" type="text" />
      <FormikField label="Description" name="description" type="text" />
    </FormikForm>
  );
};
```

Do not call `closeSidePanel` inside `onSubmit` — the mutation may still be in flight at that point.

## Closing a Modal on Success

The same pattern applies to forms opened in a [modal](modals.md): pass `saved={mutation.isSuccess}` and call `closeModal` (from `useModal`) in `onSuccess`.

```tsx
const DeleteController = ({ controllers, isViewingDetails }: DeleteControllerProps): ReactElement => {
  const { closeModal } = useModal();

  return (
    <ActionForm<EmptyObject>
      actionName={NodeActions.DELETE}
      cleanup={controllerActions.cleanup}
      initialValues={{}}
      modelName="controller"
      onCancel={closeModal}
      onSubmit={handleSubmit}
      onSuccess={closeModal}
      submitAppearance="negative"
      ...
    />
  );
};
```

Do not call `closeModal` inside `onSubmit` for the same reason — the mutation may still be in flight.

## API Error Display

Pass `errors={mutation.error}` to `FormikForm`. The component automatically formats and displays server-side validation errors inline. Do not build custom error UI for API errors.

```tsx
<FormikForm<ResourcePoolRequest, CreateResourcePoolError>
  errors={createPool.error}
  ...
>
```

The generic type parameter `E` (e.g. `CreateResourcePoolError`) tells TypeScript the shape of the error object. The formatted error message appears above the form buttons without any additional code.

## Testing Side Panel Close After Submission

Use `mockSidePanel` from `@/testing/utils` to verify that the side panel closes after a successful form submission.

```tsx
import { waitFor } from "@testing-library/react";

import AddPool from "./AddPool";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.createPool.handler());
const { mockClose } = await mockSidePanel();

describe("AddPool", () => {
  it("closes the side panel after successful submission", async () => {
    renderWithProviders(<AddPool />);

    await userEvent.type(screen.getByRole("textbox", { name: /name/i }), "test-pool");
    await userEvent.click(screen.getByRole("button", { name: /Save pool/i }));

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
```

`mockSidePanel` must be called with `await` at the top level of the test file, outside any `describe` or `it` block. The returned `mockClose` is a spy on `closeSidePanel`.

## Testing Modal Close After Submission

Use `mockModal` from `@/testing/utils` the same way to verify a modal closes after a successful submission:

```tsx
import DeleteController from "./DeleteController";

import {
  screen,
  renderWithProviders,
  userEvent,
  waitFor,
  mockModal,
} from "@/testing/utils";

const { mockClose } = await mockModal();

describe("DeleteController", () => {
  it("closes the modal after successful submission", async () => {
    renderWithProviders(<DeleteController controllers={[...]} isViewingDetails={false} />);

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
```

See [Modals](modals.md#testing-modals) for the full testing reference, including how to assert against components that can open as either a side panel or a modal.
