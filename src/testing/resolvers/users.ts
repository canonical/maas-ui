import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  CreateUserError,
  DeleteUserError,
  ListUsersError,
  ListUsersWithSummaryResponse,
  UpdateUserError,
  UsersWithSummaryListResponse,
} from "@/app/apiclient";
import { user } from "@/testing/factories";

const mockUsers: ListUsersWithSummaryResponse = {
  items: [
    user({
      id: 1,
      email: "user1@example.com",
      username: "user1",
    }),
    user({
      id: 2,
      email: "user2@example.com",
      username: "user2",
    }),
    user({
      id: 3,
      email: "user3@example.com",
      username: "user3",
    }),
  ],
  total: 3,
};

const mockListUsersError: ListUsersError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const mockCreateUserError: CreateUserError = {
  message: "A user with this name already exists.",
  code: 409,
  kind: "Error",
};

const mockUpdateUserError: UpdateUserError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockDeleteUserError: DeleteUserError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const usersResolvers = {
  listUsers: {
    resolved: false,
    handler: (data: UsersWithSummaryListResponse = mockUsers) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        usersResolvers.listUsers.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListUsersError = mockListUsersError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        usersResolvers.listUsers.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getUser: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/users/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        const user = mockUsers.items.find((user) => user.id === id);
        usersResolvers.getUser.resolved = true;
        return user ? HttpResponse.json(user) : HttpResponse.error();
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
    error: (error: UpdateUserError = mockUpdateUserError) =>
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
    error: (error: DeleteUserError = mockDeleteUserError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        usersResolvers.deleteUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { usersResolvers, mockUsers };
