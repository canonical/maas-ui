import { http, HttpResponse } from "msw";

import type {
  BadRequestBodyResponse,
  ConflictBodyResponse,
  CreateUserError,
  DeleteUserError,
  GetUserError,
  ListUsersWithSummaryError,
  ListUsersWithSummaryResponse,
  NotFoundBodyResponse,
  PreconditionFailedBodyResponse,
  UpdateUserError,
  UserWithSummaryResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import { user } from "@/testing/factories";
import type { Resolver } from "@/testing/utils";
import { mockErrors, BASE_URL } from "@/testing/utils";

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

const userResolvers: Resolver<
  UserWithSummaryResponse,
  | ConflictBodyResponse
  | BadRequestBodyResponse
  | NotFoundBodyResponse
  | PreconditionFailedBodyResponse
  | ValidationErrorBodyResponse
> = {
  listUsers: {
    resolved: false,
    handler: (data = mockUsers) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        userResolvers.listUsers.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListUsersWithSummaryError = mockErrors.listError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users_with_summary`, () => {
        userResolvers.listUsers.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getThisUser: {
    resolved: false,
    handler: (data = mockUsers.items[0]) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me_with_summary`, () => {
        userResolvers.getThisUser.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: GetUserError = mockErrors.getError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me_with_summary`, () => {
        userResolvers.getThisUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  completeIntro: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/users/me:complete_intro`, () => {
        userResolvers.completeIntro.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateUserError = mockErrors.updateError) =>
      http.put(`${BASE_URL}MAAS/a/v3/users/me:complete_intro`, () => {
        userResolvers.updateUser.resolved = true;
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
    error: (error: GetUserError = mockErrors.getError) =>
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
    error: (error: CreateUserError = mockErrors.createError) =>
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
    error: (error: UpdateUserError = mockErrors.updateError) =>
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
    error: (error: DeleteUserError = mockErrors.deleteError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        userResolvers.deleteUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { userResolvers, mockUsers };
