import { http, HttpResponse } from "msw";

import type {
  CreateUserError,
  DeleteUserError,
  GetUserError,
  ListUsersWithSummaryError,
  ListUsersWithSummaryResponse,
  UpdateUserError,
} from "@/app/apiclient";
import { user } from "@/testing/factories";
import { BASE_URL } from "@/testing/utils";

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

const mockListUsersError: ListUsersWithSummaryError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error",
};

const mockGetUserError: DeleteUserError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const mockCreateUserError: CreateUserError = {
  message: "A user with this username already exists.",
  code: 409,
  kind: "Error",
};

const userResolvers = {
  listUsers: {
    resolved: false,
    handler: (data: ListUsersWithSummaryResponse = mockUsers) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        userResolvers.listUsers.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListUsersWithSummaryError = mockListUsersError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        userResolvers.listUsers.resolved = true;
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
        userResolvers.getUser.resolved = true;
        return user ? HttpResponse.json(user) : HttpResponse.error();
      }),
    error: (error: GetUserError = mockGetUserError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.getUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createUser: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users`, () => {
        userResolvers.createUser.resolved = true;
        return HttpResponse.json({ id: 1 });
      }),
    error: (error: CreateUserError = mockCreateUserError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users`, () => {
        userResolvers.createUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updateUser: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.updateUser.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateUserError = mockGetUserError) =>
      http.put(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.updateUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteUser: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.deleteUser.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteUserError = mockGetUserError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.deleteUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { userResolvers, mockUsers };
