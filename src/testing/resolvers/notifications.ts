import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  DismissNotificationError,
  ListNotificationsError,
  ListNotificationsResponse,
} from "@/app/apiclient";
import { notificationFactoryV3 } from "@/testing/factories";

const mockNotifications: ListNotificationsResponse = {
  items: [
    notificationFactoryV3({
      id: 1,
      users: true,
      admins: true,
      message: "This is a success message",
      category: "success",
      context: {},
    }),
    notificationFactoryV3({
      id: 2,
      users: true,
      admins: true,
      message: "This is an info message",
      category: "info",
      context: {},
    }),
    notificationFactoryV3({
      id: 3,
      users: true,
      admins: true,
      message: "This is a warning message",
      category: "warning",
      context: {},
    }),
  ],
  total: 3,
};

const mockListNotificationsError: ListNotificationsError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const mockDismissNotificationError: DismissNotificationError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const notificationResolvers = {
  listNotifications: {
    resolved: false,
    handler: (data: ListNotificationsResponse = mockNotifications) =>
      http.get(`${BASE_URL}MAAS/a/v3/notifications`, ({ request }) => {
        notificationResolvers.listNotifications.resolved = true;
        const params = new URL(request.url).searchParams;
        const page = Number(params.get("page") ?? 1);
        const size = Number(params.get("size") ?? data.items.length);
        return HttpResponse.json({
          ...data,
          items: data.items.slice((page - 1) * size, page * size),
        });
      }),
    error: (
      error: ListNotificationsError = mockListNotificationsError,
      page?: number
    ) =>
      http.get(`${BASE_URL}MAAS/a/v3/notifications`, ({ request }) => {
        if (
          page !== undefined &&
          Number(new URL(request.url).searchParams.get("page")) !== page
        ) {
          return;
        }
        notificationResolvers.listNotifications.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  dismissNotification: {
    resolved: false,
    handler: () => {
      return http.post(
        `${BASE_URL}MAAS/a/v3/notifications/:id\\:dismiss`,
        () => {
          notificationResolvers.dismissNotification.resolved = true;
          return HttpResponse.json({}, { status: 200 });
        }
      );
    },
    error: (error: DismissNotificationError = mockDismissNotificationError) =>
      http.post(`${BASE_URL}MAAS/a/v3/notifications/:id\\:dismiss`, () => {
        notificationResolvers.dismissNotification.resolved = true;
        return HttpResponse.json(error, { status: 404 });
      }),
  },
};

export { notificationResolvers, mockNotifications };
