import { useEffect, useRef } from "react";

import type { ToastNotificationType } from "@canonical/react-components";
import { useToastNotification } from "@canonical/react-components";
import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  DismissNotificationError,
  DismissNotificationResponse,
  DismissNotificationData,
  ListNotificationsData,
  ListNotificationsError,
  ListNotificationsResponse,
  Options,
} from "@/app/apiclient";
import {
  dismissNotificationMutation,
  listNotificationsOptions,
  listNotificationsQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useListNotifications = (
  options?: Options<ListNotificationsData>
) => {
  return useWebsocketAwareQuery({
    ...(listNotificationsOptions(options) as UseQueryOptions<
      ListNotificationsData,
      ListNotificationsError,
      ListNotificationsResponse
    >),
    refetchInterval: 30000,
  });
};

export const convertBackendItToToastNotificationId = (id: number): string => {
  return `notification-${id}`;
};

export const convertToastNotificationIdToBackendId = (id: string): number => {
  const match = /notification-(\d+)/.exec(id);
  if (match && match[1]) {
    return Number(match[1]);
  }
  throw new Error(`Invalid notification ID format: ${id}`);
};

export const useNotifications = () => {
  const backendNotifications = useListNotifications({
    query: { only_active: true },
  });
  const items = backendNotifications.data?.items;
  const notifications = useToastNotification();
  const shownIds = useRef(new Set<number>());
  useEffect(() => {
    if (items === undefined) return;
    items.forEach((item) => {
      if (shownIds.current.has(item.id)) return;

      shownIds.current.add(item.id);
      switch (item.category) {
        case "success":
          notifications.success(
            item.message,
            [],
            "",
            convertBackendItToToastNotificationId(item.id)
          );
          break;
        case "error":
          notifications.failure(
            "Error",
            "",
            item.message,
            [],
            convertBackendItToToastNotificationId(item.id)
          );
          break;
        case "warning":
          notifications.caution(
            item.message,
            [],
            "Warning",
            convertBackendItToToastNotificationId(item.id)
          );
          break;
        case "info":
          notifications.info(
            item.message,
            "",
            [],
            convertBackendItToToastNotificationId(item.id)
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
  return useMutation<
    DismissNotificationResponse,
    DismissNotificationError,
    Options<DismissNotificationData>
  >({
    ...dismissNotificationMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listNotificationsQueryKey(),
      });
    },
  });
};

export const useDismissNotifications = () => {
  const dismissMutatation = useDismissNotification();
  return (notifications: ToastNotificationType[] | undefined) => {
    if (notifications) {
      notifications.forEach((notification) => {
        dismissMutatation.mutate({
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
