# API Query and Mutation Hooks Standards

## TL;DR

- Auto-generated SDK lives in `src/app/apiclient`
- Manually write hooks in `src/app/api/query/` using the generated react-query.ts hooks
- Use `useWebsocketAwareQuery` for queries to auto-invalidate on websocket updates
- Use `useMutation` with `invalidateQueries` in `onSuccess` for mutations
- Create mock resolvers in `src/testing/resolvers/` using MSW (Mock Service Worker)
- Test hooks using `renderHookWithProviders` and mock resolvers
- Follow naming convention: `use<Resource>` for list queries, `use<Action><Resource>` for single item and operation queries

## Overview

Our API layer follows a three-tier architecture:

1. **Auto-generated SDK** (`src/app/apiclient`) - Generated from OpenAPI spec
2. **Custom hooks** (`src/app/api/query/`) - Manually written React Query hooks
3. **Mock resolvers** (`src/testing/resolvers/`) - MSW handlers for testing

## Writing Query Hooks

### Basic List Query

Use `useWebsocketAwareQuery` to automatically invalidate when websocket updates occur:

```typescript

export const useUsers = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery(
    listUsersWithSummaryOptions(options) as UseQueryOptions<
      ListUsersWithSummaryData,
      ListUsersWithSummaryError,
      ListUsersWithSummaryResponse
    >
  );
};
```

### Single Item Query

```typescript
export const useGetUser = (options: Options<GetUserData>) => {
  return useWebsocketAwareQuery(
    getUserOptions(options) as UseQueryOptions<
      GetUserData,
      GetUserError,
      GetUserResponse
    >
  );
};
```

### Derived Queries

For queries that transform data, use the `select` option:

```typescript
export const useUserCount = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...listUsersWithSummaryOptions(options),
    select: (data) => data?.total ?? 0,
  } as UseQueryOptions<
    ListUsersWithSummaryResponse,
    ListUsersWithSummaryError,
    number
  >);
};
```

## Writing Mutation Hooks

### Basic Mutation

Always invalidate related queries in `onSuccess`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateUserData,
  CreateUserError,
  CreateUserResponse,
  Options,
} from "@/app/apiclient";
import {
  createUserMutation,
  listUsersWithSummaryQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useCreateUser = (mutationOptions?: Options<CreateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateUserResponse,
    CreateUserError,
    Options<CreateUserData>
  >({
    ...createUserMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};
```

### Update Mutation

```typescript
export const useUpdateUser = (mutationOptions?: Options<UpdateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateUserResponse,
    UpdateUserError,
    Options<UpdateUserData>
  >({
    ...updateUserMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};
```

### Delete Mutation

```typescript
export const useDeleteUser = (mutationOptions?: Options<DeleteUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteUserResponse,
    DeleteUserError,
    Options<DeleteUserData>
  >({
    ...deleteUserMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};
```

## Writing Mock Resolvers

Mock resolvers use [MSW (Mock Service Worker)](https://mswjs.io/) to intercept HTTP requests during testing. Create a resolver file in `src/testing/resolvers/` for each resource.

### Resolver Structure

Each resolver file should follow this structure:

1. **Mock data constants** - Default response data using factories
2. **Error constants** - Default error responses for each operation
3. **Resolver object** - Contains handlers for each endpoint operation
4. **Exports** - Export both the resolvers and mock data

### Key Principles

- **Overridable responses**: Both `handler()` and `error()` functions should accept optional parameters to override default responses
- **Resolved flag**: Track when a resolver has been called using a `resolved` boolean
- **Default errors**: Provide sensible default error objects that can be overridden
- **Use factories**: Generate mock data using factory functions for consistency

### Complete Example

```typescript
import { http, HttpResponse } from "msw";
import { BASE_URL } from "../utils";
import type {
  CreateUserError,
  DeleteUserError,
  GetUserError,
  ListUsersError,
  ListUsersWithSummaryResponse,
  UpdateUserError,
} from "@/app/apiclient";
import { user as userFactory } from "@/testing/factories";

// 1. Define default mock data using factories
const mockUsers: ListUsersWithSummaryResponse = {
  items: [
    userFactory({ id: 1, email: "user1@example.com", username: "user1" }),
    userFactory({ id: 2, email: "user2@example.com", username: "user2" }),
  ],
  total: 2,
};

// 2. Define default error responses
const mockListUsersError: ListUsersError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // Always "Error" for error responses
};

const mockGetUserError: GetUserError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const mockCreateUserError: CreateUserError = {
  message: "A user with this username already exists.",
  code: 409,
  kind: "Error",
};

// 3. Create the resolver object
const usersResolvers = {
  listUsers: {
    resolved: false,
    // Handler accepts optional data parameter to override default response
    handler: (data: ListUsersWithSummaryResponse = mockUsers) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        usersResolvers.listUsers.resolved = true;
        return HttpResponse.json(data);
      }),
    // Error handler accepts optional error parameter to override default
    error: (error: ListUsersError = mockListUsersError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        usersResolvers.listUsers.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getUser: {
    resolved: false,
    // For single item queries, extract ID from params
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/users/:id`, ({ params }) => {
        const id = Number(params.id);
        const user = mockUsers.items.find((user) => user.id === id);
        usersResolvers.getUser.resolved = true;
        return user ? HttpResponse.json(user) : HttpResponse.error();
      }),
    error: (error: GetUserError = mockGetUserError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.getUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createUser: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users`, () => {
        usersResolvers.createUser.resolved = true;
        return HttpResponse.json({ id: 1 });
      }),
    error: (error: CreateUserError = mockCreateUserError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users`, () => {
        usersResolvers.createUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updateUser: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.updateUser.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateUserError) =>
      http.put(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.updateUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteUser: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.deleteUser.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteUserError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.deleteUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

// 4. Export both resolvers and mock data for reuse in tests
export { usersResolvers, mockUsers };
```

### Using Resolvers in Tests

**Override default response data:**

```typescript
// Return empty list
mockServer.use(usersResolvers.listUsers.handler({ items: [], total: 0 }));

// Return specific data
mockServer.use(
  usersResolvers.listUsers.handler({
    items: [userFactory({ id: 999, username: "special-user" })],
    total: 1,
  })
);
```

**Override default errors:**

```typescript
// Custom error message
mockServer.use(
  usersResolvers.createUser.error({
    message: "Custom error message",
    code: 500,
    kind: "Error",
  })
);

// Use default error
mockServer.use(usersResolvers.createUser.error());
```

**Check if resolver was called:**

```typescript
await userEvent.click(screen.getByRole("button", { name: /save/i }));

await waitFor(() => {
  expect(usersResolvers.createUser.resolved).toBeTruthy();
});
```

## Testing Hooks

### Test Structure

```typescript
import { useUsers, useCreateUser } from "@/app/api/query/users";
import { usersResolvers, mockUsers } from "@/testing/resolvers/users";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.createUser.handler()
);

describe("useUsers", () => {
  it("should return users data", async () => {
    const { result } = renderHookWithProviders(() => useUsers());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockUsers);
  });

  it("should handle empty list", async () => {
    mockServer.use(usersResolvers.listUsers.handler({ items: [], total: 0 }));
    const { result } = renderHookWithProviders(() => useUsers());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toHaveLength(0);
  });

  it("should handle errors", async () => {
    mockServer.use(usersResolvers.listUsers.error());
    const { result } = renderHookWithProviders(() => useUsers());
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

### Testing Mutations

```typescript
describe("useCreateUser", () => {
  it("should create a new user", async () => {
    const newUser = {
      email: "new@example.com",
      username: "newuser",
      password: "password",
    };
    const { result } = renderHookWithProviders(() => useCreateUser());
    result.current.mutate({ body: newUser });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle creation errors", async () => {
    mockServer.use(
      usersResolvers.createUser.error({
        message: "User already exists",
        code: 409,
        kind: "Error",
      })
    );
    const { result } = renderHookWithProviders(() => useCreateUser());
    result.current.mutate({ body: { username: "test" } });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe("User already exists");
  });
});
```

### Testing Single Item Queries

```typescript
describe("useGetUser", () => {
  it("should return the correct user", async () => {
    const expectedUser = mockUsers.items[0];
    const { result } = renderHookWithProviders(() =>
      useGetUser({ path: { user_id: expectedUser.id } })
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(expectedUser);
  });

  it("should return error if user does not exist", async () => {
    const { result } = renderHookWithProviders(() =>
      useGetUser({ path: { user_id: 999 } })
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

## Best Practices

1. **Naming Conventions**:

   - List queries: `use<ResourcePlural>` (e.g., `useUsers`, `usePools`)
   - Single item: `useGet<Resource>` (e.g., `useGetUser`, `useGetPool`)
   - Mutations: `use<Mutation><Resource>` (e.g., `useCreate<Resource>`, `useUpdate<Resource>`, `useDelete<Resource>`)
   - Derivations: `use<Resource><Derivation>` (e.g., `use<Resource>Count`)

2. **Query Invalidation**:

   - Always invalidate related queries after mutations
   - Use `invalidateQueries` with the appropriate query key from the generated SDK

3. **WebSocket Awareness**:

   - Use `useWebsocketAwareQuery` for all queries to automatically invalidate on real-time updates
   - Map websocket models to query keys in `base.ts` if needed

4. **Type Safety**:

   - Always use the generated types from `@/app/apiclient`
   - Cast query options to proper types with `as UseQueryOptions`

5. **Error Handling**:

   - All error types have `message`, `code`, and `kind` fields
   - Use the `errors` prop on forms to display mutation errors

6. **Testing**:

   - Use `setupMockServer` to configure MSW handlers
   - Use `renderHookWithProviders` to test hooks with React Query context
   - Test success, error, and edge cases for all hooks
   - Use `waitFor` to wait for async operations

7. **Mock Data**:
   - Export mock data from resolver files for reuse in tests
   - Use factories to generate test data
   - Provide both success and error handlers for all endpoints

## Common Pitfalls

- **Don't** forget to invalidate queries after mutations - stale data is confusing for users
- **Don't** use `useQuery` directly - always use `useWebsocketAwareQuery` for queries
- **Don't** forget to export mock data from resolver files
- **Don't** forget to set `resolved` flag in resolvers - it's useful for testing
- **Don't** forget to handle empty states in tests
- **Don't** forget to type cast query options - TypeScript won't catch type mismatches otherwise
