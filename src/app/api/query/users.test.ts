import {
  useCreateUser,
  useDeleteUser,
  useGetUser,
  useUpdateUser,
  useUsers,
} from "@/app/api/query/users";
import type { UserRequest } from "@/app/apiclient";
import { mockUsers, userResolvers } from "@/testing/resolvers/users";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  userResolvers.listUsers.handler(),
  userResolvers.getUser.handler(),
  userResolvers.createUser.handler(),
  userResolvers.updateUser.handler(),
  userResolvers.deleteUser.handler()
);

describe("useUsers", () => {
  it("should return users data", async () => {
    const { result } = renderHookWithProviders(() => useUsers());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockUsers);
  });
});

describe("useGetUser", () => {
  it("should return the correct user", async () => {
    const expectedUser = mockUsers.items[0];
    const { result } = renderHookWithProviders(() =>
      useGetUser({ path: { user_id: expectedUser.id } })
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(expectedUser);
  });

  it("should return error if user does not exist", async () => {
    const { result } = renderHookWithProviders(() =>
      useGetUser({ path: { user_id: 99 } })
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateUser", () => {
  it("should create a new user", async () => {
    const newUser: UserRequest = {
      email: "new.user@example.com",
      first_name: "Test",
      last_name: "User",
      is_active: false,
      is_staff: false,
      is_superuser: false,
      password: "xxxx",
      username: "new-user",
    };
    const { result } = renderHookWithProviders(() => useCreateUser());
    result.current.mutate({ body: newUser });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateUser", () => {
  it("should update a user", async () => {
    const updatedUser: UserRequest = {
      email: "updated.user@example.com",
      first_name: "Test",
      last_name: "User",
      is_active: false,
      is_staff: false,
      is_superuser: false,
      password: "xxxx",
      username: "updated-user",
    };
    const { result } = renderHookWithProviders(() => useUpdateUser());
    result.current.mutate({ body: updatedUser, path: { user_id: 1 } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteUser", () => {
  it("should delete a user", async () => {
    const { result } = renderHookWithProviders(() => useDeleteUser());
    result.current.mutate({ path: { user_id: 1 } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
