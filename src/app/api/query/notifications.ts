import { useEffect } from "react";

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

export const useNotifications = () => {
  const backendNotifications = useListNotifications({
    query: { only_active: true },
  });
  const items = backendNotifications.data?.items;
  const notifications = useToastNotification();
  const dismissMutatation = useDismissNotification();
  useEffect(() => {
    if (items === undefined) return;
    items.forEach((item) => {
      switch (item.category) {
        case "success":
          notifications.success(
            item.message,
            [
              {
                label: "Dismiss",
                onClick: () => {
                  dismissMutatation.mutate({
                    path: { notification_id: item.id },
                  });
                },
              },
            ],
            ""
          );
          break;
        case "error":
          notifications.failure(item.message, [
            {
              label: "Dismiss",
              onClick: () => {
                dismissMutatation.mutate({
                  path: { notification_id: item.id },
                });
              },
            },
          ]);
          break;
        case "warning":
          notifications.caution(item.message, [
            {
              label: "Dismiss",
              onClick: () => {
                dismissMutatation.mutate({
                  path: { notification_id: item.id },
                });
              },
            },
          ]);
          break;
        case "info":
          notifications.info(item.message, "", [
            {
              label: "Dismiss",
              onClick: () => {
                dismissMutatation.mutate({
                  path: { notification_id: item.id },
                });
              },
            },
          ]);
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
