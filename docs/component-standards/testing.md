# Testing Best Practices

## TL;DR

- Import all test utilities from `@/testing/utils` (includes `renderWithProviders`, `screen`, `waitFor`, `userEvent`, `within`, etc.)
- Use `renderWithProviders` for all modern component tests
- Use `setupMockServer` to configure MSW for API mocking
- Use `renderHookWithProviders` for testing custom hooks
- Use `mockSidePanel` to mock side panel context
- Use `mockIsPending` to mock loading states
- Organize tests with `describe` blocks for display, validation, permissions, and actions
- Use `waitFor` for async assertions
- Use `userEvent` for simulating user interactions
- Legacy tests may use `configureStore()` for Redux state - consider these outdated

## Overview

We use [Vitest](https://vitest.dev/) as our test runner and [React Testing Library](https://testing-library.com/react) for component testing. API mocking is handled by [MSW (Mock Service Worker)](https://mswjs.io/).

**Important**: All testing utilities should be imported from `@/testing/utils`, which re-exports common utilities from Testing Library (`screen`, `waitFor`, `within`, `userEvent`) along with our custom testing helpers (`renderWithProviders`, `setupMockServer`, `mockSidePanel`, etc.). This ensures consistency across the codebase.

## Modern Testing Patterns

### Component Tests with `renderWithProviders`

`renderWithProviders` is the standard way to render components in tests. It provides all necessary context providers (React Query, Redux, Router, WebSocket, Side Panel), eliminating the need to manually wrap components in providers. This ensures your tests run in an environment that closely mirrors your application's runtime context.

```typescript
import { renderWithProviders, screen, waitFor } from "@/testing/utils";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", async () => {
    renderWithProviders(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });
});
```

### Setting Up Mock Server

Use `setupMockServer` at the top of your test file to configure MSW handlers. This function handles the complete lifecycle of the mock server.

```typescript
import { setupMockServer, renderWithProviders } from "@/testing/utils";
import { usersResolvers } from "@/testing/resolvers/users";
import MyComponent from "./MyComponent";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.createUser.handler()
);

describe("MyComponent", () => {
  it("displays users", async () => {
    renderWithProviders(<MyComponent />);
    // Test implementation
  });
});
```

The `setupMockServer` function:

- Automatically sets up and tears down the mock server
- Resets handlers between tests
- Accepts any number of request handlers

### Overriding Mock Responses

Override default mock responses using `mockServer.use()`. This allows you to customize API responses for specific test cases, enabling you to test error states, empty states, and edge cases without modifying your resolver files.

```typescript
it("handles empty state", async () => {
  mockServer.use(usersResolvers.listUsers.handler({ items: [], total: 0 }));
  renderWithProviders(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText("No users found")).toBeInTheDocument();
  });
});

it("handles errors", async () => {
  mockServer.use(
    usersResolvers.listUsers.error({
      message: "Failed to load users",
      code: 500,
      kind: "Error",
    })
  );
  renderWithProviders(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText("Failed to load users")).toBeInTheDocument();
  });
});
```

### Testing with Custom State

Pass custom Redux state to `renderWithProviders` to test components in specific application states. This is useful for testing permission-based UI, user-specific content, or any component behavior that depends on Redux state.

```typescript
import * as factory from "@/testing/factories";

it("displays user-specific content", () => {
  renderWithProviders(<MyComponent />, {
    state: {
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ username: "admin" }),
        }),
      }),
    },
  });

  expect(screen.getByText("Welcome, admin")).toBeInTheDocument();
});
```

### Testing Hooks

Use `renderHookWithProviders` to test custom hooks in isolation. This wrapper provides all necessary context (React Query, Redux, WebSocket) that your hooks might depend on, allowing you to test hook logic independently from components.

```typescript
import { renderHookWithProviders, waitFor } from "@/testing/utils";
import { useUsers } from "@/app/api/query/users";
import { usersResolvers, mockUsers } from "@/testing/resolvers/users";

const mockServer = setupMockServer(usersResolvers.listUsers.handler());

describe("useUsers", () => {
  it("returns users data", async () => {
    const { result } = renderHookWithProviders(() => useUsers());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUsers);
  });
});
```

### Mocking Loading States

Use `mockIsPending` to test loading states without waiting for actual API calls. This utility mocks React Query's `useQuery` to return a pending state, allowing you to verify that your loading UI renders correctly.

```typescript
import { mockIsPending, renderWithProviders, screen, waitFor } from "@/testing/utils";

it("displays loading state", async () => {
  mockIsPending();
  renderWithProviders(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

### Mocking Side Panel

Use `mockSidePanel` to mock side panel interactions and verify that your components correctly open and close side panels with the expected content and properties.

```typescript
import { mockSidePanel, renderWithProviders, screen, userEvent } from "@/testing/utils";

const { mockOpen, mockClose } = await mockSidePanel();

describe("MyComponent", () => {
  it("opens side panel when button clicked", async () => {
    renderWithProviders(<MyComponent />);

    await userEvent.click(screen.getByRole("button", { name: /add user/i }));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Add user",
      })
    );
  });

  it("closes side panel on cancel", async () => {
    renderWithProviders(<MyForm />);

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockClose).toHaveBeenCalled();
  });
});
```

## Test Structure

### Organize with `describe` Blocks

Always organize tests into logical groups using `describe` blocks. This improves test readability, makes it easier to locate specific tests, and provides better structure in test output.

```typescript
describe("MyComponent", () => {
  describe("display", () => {
    it("renders loading state", () => {});
    it("renders empty state", () => {});
    it("renders data correctly", () => {});
  });

  describe("validation", () => {
    it("shows error for invalid input", () => {});
    it("prevents submission with errors", () => {});
  });

  describe("permissions", () => {
    it("disables buttons without permissions", () => {});
    it("enables buttons with permissions", () => {});
  });

  describe("actions", () => {
    it("submits form on save", () => {});
    it("closes on cancel", () => {});
  });
});
```

## Common Testing Patterns

### User Interactions

Use `userEvent` for simulating user actions. This library provides more realistic user interactions than the legacy `fireEvent` API, including proper focus management and keyboard event sequences.

```typescript
import { userEvent, screen } from "@/testing/utils";

// Clicking buttons
await userEvent.click(screen.getByRole("button", { name: /save/i }));

// Typing in text fields
await userEvent.type(
  screen.getByRole("textbox", { name: /username/i }),
  "testuser"
);

// Selecting options
await userEvent.selectOptions(
  screen.getByRole("combobox", { name: /role/i }),
  "admin"
);

// Checking checkboxes
await userEvent.click(screen.getByRole("checkbox", { name: /accept/i }));
```

### Querying Elements

Use semantic queries from `screen` to find elements in your tests. Prioritize queries that reflect how users interact with your application (by role, label, or text) rather than implementation details like test IDs.

```typescript
// By role (preferred)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });
screen.getByRole("heading", { name: /welcome/i });

// By label text
screen.getByLabelText("Username");
screen.getByLabelText(/password/i);

// By text content
screen.getByText("Hello World");
screen.getByText(/loading/i);

// By test ID (use sparingly)
screen.getByTestId("custom-element");

// Query variants
screen.queryByRole("button"); // Returns null if not found
screen.findByRole("button"); // Returns promise, waits for element
```

### Async Assertions

Always use `waitFor` for async assertions to handle asynchronous state updates, API calls, and DOM changes. Never use arbitrary timeouts or delays in tests.

```typescript
import { waitFor } from "@/testing/utils";

// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

// Wait for hook to resolve
await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

### Testing Within Specific Elements

Use `within` to query inside a specific element, which is particularly useful for testing table rows, list items, or any nested content where you need to scope your queries.

```typescript
import { within } from "@/testing/utils";

const row = screen.getByRole("row", { name: /john doe/i });
expect(within(row).getByText("admin")).toBeInTheDocument();
expect(within(row).getByRole("button", { name: /edit/i })).toBeInTheDocument();
```

### Checking Resolver Calls

Verify that API calls were made by checking the `resolved` flag on your mock resolvers. This is useful for confirming that form submissions or user actions trigger the expected API requests.

```typescript
await userEvent.click(screen.getByRole("button", { name: /save/i }));

await waitFor(() => {
  expect(usersResolvers.createUser.resolved).toBeTruthy();
});
```

## Legacy Patterns (Avoid in New Code)

### Using `configureStore()` Directly

Legacy tests may create Redux stores manually using `configureStore()` from `redux-mock-store`. This pattern predates our modern testing utilities and should be avoided in new code. Instead, pass state directly to `renderWithProviders`.

```typescript
// ❌ Legacy pattern - avoid in new code
import configureStore from "redux-mock-store";
import * as factory from "@/testing/factories";

const mockStore = configureStore();
const store = mockStore(factory.rootState());

// ✅ Modern pattern - use renderWithProviders instead
renderWithProviders(<MyComponent />, {
  state: factory.rootState(),
});
```

### Other Legacy Utilities

These utilities exist for legacy tests but should not be used in new code:

- `renderWithBrowserRouter` - Use `renderWithProviders` instead
- `WithMockStoreProvider` - Use `renderWithProviders` instead
- Manual Redux store setup - Use `renderWithProviders` instead

## Common Pitfalls

- **Don't** forget to use `await` with `userEvent` methods
- **Don't** forget to use `waitFor` for async assertions
- **Don't** query elements that should not exist with `getBy*` - use `queryBy*` instead
- **Don't** test implementation details - test what users see and do
- **Don't** forget to set up mock server handlers before tests
- **Don't** use `configureStore()` directly in new tests - use `renderWithProviders`
- **Don't** mock components or hooks - mock at the network layer with MSW
- **Don't** forget to reset mock functions between tests (handled automatically by `setupMockServer`)
- **Don't** use `getByTestId` unless absolutely necessary - prefer semantic queries

## Debugging Tests

### View Rendered Output

Use `screen.debug()` to print the current DOM structure when debugging test failures. This helps you understand what's actually rendered versus what you expect.

```typescript
import { screen } from "@/testing/utils";

// Print the current DOM
screen.debug();

// Print a specific element
screen.debug(screen.getByRole("button"));
```

### Check Available Queries

```typescript
// See all available roles
screen.logTestingPlaygroundURL();
```

### View Network Requests

MSW will warn you if an unhandled request is detected, which helps identify missing mock handlers. For more detailed request logging, you can add custom logging to your mock resolvers or use MSW's debugging features.
