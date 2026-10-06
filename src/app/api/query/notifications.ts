import { useEffect, useRef } from "react";

import type { ToastNotificationType } from "@canonical/react-components";
import { useToastNotification } from "@canonical/react-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type { WithHeaders } from "@/app/api/utils";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  DismissNotificationData,
  DismissNotificationErrors,
  DismissNotificationResponses,
  ListNotificationsData,
  ListNotificationsError,
  ListNotificationsErrors,
  ListNotificationsResponse,
  ListNotificationsResponses,
  NotificationResponse,
  Options,
} from "@/app/apiclient";
import { dismissNotification, listNotifications } from "@/app/apiclient";
import { listNotificationsQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import { DEFAULT_PAGE_SIZE } from "@/app/base/constants";

const notificationQueryOptions = (options?: Options<ListNotificationsData>) =>
  queryOptionsWithHeaders<
    ListNotificationsResponses,
    ListNotificationsErrors,
    ListNotificationsData
  >(options, listNotifications, listNotificationsQueryKey(options));

export const useListNotifications = (
  options?: Options<ListNotificationsData>
) => {
  return useWebsocketAwareQuery({
    ...notificationQueryOptions(options),
    refetchInterval: 30000,
  });
};

export const useActiveNotifications = () =>
  useWebsocketAwareQuery<
    WithHeaders<ListNotificationsResponse>,
    Error | ListNotificationsError
  >({
    queryKey: [
      ...listNotificationsQueryKey({ query: { only_active: true } }),
      "all",
    ],
    queryFn: async (context) => {
      const fetchPage = (page: number) => {
        const { queryFn, queryKey } = notificationQueryOptions({
          query: { only_active: true, page, size: DEFAULT_PAGE_SIZE },
        });
        if (typeof queryFn !== "function") {
          throw new Error("Notification query function is not available.");
        }
        return queryFn({ ...context, queryKey });
      };
      const firstPage = await fetchPage(1);
      const items = [...firstPage.items];
      const pageCount = Math.ceil(firstPage.total / DEFAULT_PAGE_SIZE);
      for (let page = 2; page <= pageCount; page++) {
        const nextPage = await fetchPage(page);
        items.push(...nextPage.items);
      }
      return { ...firstPage, items };
    },
    refetchInterval: 30000,
  });

const HARDENING_NOTIFICATION_IDENT_PREFIX = "hardening-";

export const isHardeningNotification = (
  notification: NotificationResponse
): boolean =>
  notification.ident?.startsWith(HARDENING_NOTIFICATION_IDENT_PREFIX) ?? false;

export const convertBackendIdToToastNotificationId = (id: number): string => {
  return `notification-${id}`;
};

export const convertToastNotificationIdToBackendId = (id: string): number => {
  const match = /notification-(\d+)/.exec(id);
  if (match && match[1]) {
    return Number(match[1]);
  }
  throw new Error(`Invalid notification ID format: ${id}`);
};

export const isBackendNotificationId = (id: string): boolean =>
  /^notification-\d+$/.test(id);

export const useNotifications = () => {
  const backendNotifications = useActiveNotifications();
  const items = backendNotifications.data?.items;
  const notifications = useToastNotification();
  const shownIds = useRef(new Set<number>());
  useEffect(() => {
    if (items === undefined) return;
    items.forEach((item) => {
      // Hardening requirements are shown in a persistent, non-dismissible banner.
      if (isHardeningNotification(item)) return;
      if (shownIds.current.has(item.id)) return;

      shownIds.current.add(item.id);
      switch (item.category) {
        case "success":
          notifications.success(
            item.message,
            [],
            "",
            convertBackendIdToToastNotificationId(item.id)
          );
          break;
        case "error":
          notifications.failure(
            "Error",
            "",
            item.message,
            [],
            convertBackendIdToToastNotificationId(item.id)
          );
          break;
        case "warning":
          notifications.caution(
            item.message,
            [],
            "Warning",
            convertBackendIdToToastNotificationId(item.id)
          );
          break;
        case "info":
          notifications.info(
            item.message,
            "",
            [],
            convertBackendIdToToastNotificationId(item.id)
          );
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
};

export const useDismissNotification = (
  mutationOptions?: Options<DismissNotificationData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DismissNotificationResponses,
      DismissNotificationErrors,
      DismissNotificationData
    >(mutationOptions, dismissNotification),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listNotificationsQueryKey(),
      });
    },
  });
};

type DismissMutateFn = ReturnType<typeof useDismissNotification>["mutate"];

export const useDismissNotifications = (dismissMutation: DismissMutateFn) => {
  return (notifications: ToastNotificationType[] | undefined) => {
    if (notifications) {
      notifications.forEach((notification) => {
        // Temporary/local toasts (e.g. those created via `failure`) don't have
        // a backend notification ID, so there's nothing to dismiss on the
        // server. They're removed from the stack by the provider directly.
        if (!isBackendNotificationId(notification.id)) {
          return;
        }
        dismissMutation({
          path: {
            notification_id: convertToastNotificationIdToBackendId(
              notification.id
            ),
          },
        });
      });
    }
  };
};
