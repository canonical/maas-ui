import { useEffect } from "react";

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
  return useWebsocketAwareQuery(
    listNotificationsOptions(options) as UseQueryOptions<
      ListNotificationsData,
      ListNotificationsError,
      ListNotificationsResponse
    >
  );
};

export const convertBackendItToToastNotificationId = (id: number): string => {
  return `notification-${id}`;
};

export const convertToastNotificationIdToBackendIt = (id: string): number => {
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
  useEffect(() => {
    if (items === undefined) return;
    items.forEach((item) => {
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
            item.id.toString()
          );
          break;
        case "warning":
          notifications.caution(
            item.message,
            [],
            "Warning",
            item.id.toString()
          );
          break;
        case "info":
          notifications.info(item.message, "", [], item.id.toString());
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
            notification_id: convertToastNotificationIdToBackendIt(
              notification.id
            ),
          },
        });
      });
    }
  };
};
