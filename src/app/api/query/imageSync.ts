import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ACTIVE_DOWNLOAD_REFETCH_INTERVAL,
  IMAGES_WORKFLOW_KEY,
  withImagesWorkflow,
} from "@/app/api/query/images";
import { mutationOptionsWithHeaders } from "@/app/api/utils";
import type {
  Options,
  SyncBootsourceBootsourceselectionData,
  SyncBootsourceBootsourceselectionErrors,
  SyncBootsourceBootsourceselectionResponses,
  ListSelectionStatusResponse,
  ListCustomImagesStatusResponse,
  StopSyncBootsourceBootsourceselectionData,
  StopSyncBootsourceBootsourceselectionErrors,
  StopSyncBootsourceBootsourceselectionResponses,
  ImageUpdateStatus,
  ImageStatus,
} from "@/app/apiclient";
import {
  listCustomImagesStatus,
  listSelectionStatus,
  syncBootsourceBootsourceselection,
  stopSyncBootsourceBootsourceselection,
} from "@/app/apiclient";
import {
  listCustomImagesStatisticQueryKey,
  listCustomImagesStatusQueryKey,
  listSelectionStatisticQueryKey,
  listSelectionStatusQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

type PollEntry = {
  attempts: number;
};

type SilentPollState = {
  active: boolean;
  entries: Map<number, PollEntry>;
  timer: ReturnType<typeof setTimeout> | null;
};

const silentPoll: SilentPollState = {
  active: false,
  entries: new Map(),
  timer: null,
};

const POLL_INTERVAL = ACTIVE_DOWNLOAD_REFETCH_INTERVAL;
const MAX_ATTEMPTS_PER_IMAGE = 10;

const startOrExtendSilentPolling = (queryClient: QueryClient) => {
  if (silentPoll.active) {
    return;
  }

  silentPoll.active = true;

  const poll = async () => {
    const [selectionResult, customImageResult] = await Promise.all([
      listSelectionStatus(),
      listCustomImagesStatus(),
    ]);

    const selectionItems = selectionResult?.data?.items ?? [];
    const customItems = customImageResult?.data?.items ?? [];

    for (const [imageId, entry] of silentPoll.entries) {
      entry.attempts++;

      const backendSyncStatus =
        selectionItems.find((i) => i.id === imageId)?.status ??
        customItems.find((i) => i.id === imageId)?.status;

      const backendUpdateStatus =
        selectionItems.find((i) => i.id === imageId)?.update_status ??
        customItems.find((i) => i.id === imageId)?.update_status;

      const resolved =
        backendSyncStatus === "Downloading" ||
        backendUpdateStatus === "Downloading" ||
        entry.attempts >= MAX_ATTEMPTS_PER_IMAGE;

      if (resolved) {
        silentPoll.entries.delete(imageId);
      }
    }

    if (silentPoll.entries.size === 0) {
      silentPoll.active = false;
      silentPoll.timer = null;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listSelectionStatusQueryKey()),
        }),
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listSelectionStatisticQueryKey()),
        }),
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listCustomImagesStatusQueryKey()),
        }),
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listCustomImagesStatisticQueryKey()),
        }),
      ]);

      return;
    }

    silentPoll.timer = setTimeout(poll, POLL_INTERVAL);
  };

  silentPoll.timer = setTimeout(poll, POLL_INTERVAL / 2);
};

export const resetSilentPolling = () => {
  if (silentPoll.timer) {
    clearTimeout(silentPoll.timer);
  }

  silentPoll.entries.clear();
  silentPoll.active = false;
  silentPoll.timer = null;
};

export const useStartImageSync = (
  mutationOptions?: Options<SyncBootsourceBootsourceselectionData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptionsWithHeaders<
      SyncBootsourceBootsourceselectionResponses,
      SyncBootsourceBootsourceselectionErrors,
      SyncBootsourceBootsourceselectionData
    >(mutationOptions, syncBootsourceBootsourceselection),

    onMutate: async (variables) => {
      const imageId = variables.path.id;

      // Cancel all queries to prevent overwrites
      await queryClient.cancelQueries();

      // Get data using predicate instead of exact key match
      const selectionStatusQueries =
        queryClient.getQueriesData<ListSelectionStatusResponse>({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[0] === "images-workflow" &&
              typeof key[1] === "object" &&
              key[1]?._id === "listSelectionStatus"
            );
          },
        });

      const customImageStatusQueries =
        queryClient.getQueriesData<ListCustomImagesStatusResponse>({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[0] === "images-workflow" &&
              typeof key[1] === "object" &&
              key[1]?._id === "listCustomImagesStatus"
            );
          },
        });

      // Extract the actual query keys and data
      const [selectionStatusKey, previousSelectionStatuses] =
        selectionStatusQueries[0] || [null, null];
      const [customImageStatusKey, previousCustomImageStatuses] =
        customImageStatusQueries[0] || [null, null];

      // Optimistically update selection statuses to "Optimistic"
      if (selectionStatusKey && previousSelectionStatuses) {
        const updatedSelectionStatuses = {
          ...previousSelectionStatuses,
          items: previousSelectionStatuses.items.map((item) => {
            if (item.id === imageId && item.status === "Waiting for download") {
              return {
                ...item,
                status: "Optimistic" as ImageStatus,
                sync_percentage: 0,
              };
            } else if (
              item.id === imageId &&
              item.update_status === "Update available"
            ) {
              return {
                ...item,
                update_status: "Optimistic" as ImageUpdateStatus,
                sync_percentage: 0,
              };
            }
            return item;
          }),
        };

        queryClient.setQueryData<ListSelectionStatusResponse>(
          selectionStatusKey,
          updatedSelectionStatuses
        );
      }

      // Optimistically update custom image statuses to "Optimistic"
      if (customImageStatusKey && previousCustomImageStatuses) {
        const updatedCustomImageStatuses = {
          ...previousCustomImageStatuses,
          items: previousCustomImageStatuses.items.map((item) => {
            if (item.id === imageId && item.status === "Waiting for download") {
              return {
                ...item,
                status: "Optimistic" as ImageStatus,
                sync_percentage: 0,
              };
            } else if (
              item.id === imageId &&
              item.update_status === "Update available"
            ) {
              return {
                ...item,
                update_status: "Optimistic" as ImageUpdateStatus,
                sync_percentage: 0,
              };
            }
            return item;
          }),
        };

        queryClient.setQueryData<ListCustomImagesStatusResponse>(
          customImageStatusKey,
          updatedCustomImageStatuses
        );
      }

      return {
        selectionStatusKey,
        customImageStatusKey,
        previousSelectionStatuses,
        previousCustomImageStatuses,
        imageId,
      };
    },

    onError: (_err, _variables, context) => {
      // Rollback to previous state if mutation fails
      if (context?.selectionStatusKey && context?.previousSelectionStatuses) {
        queryClient.setQueryData(
          context.selectionStatusKey,
          context.previousSelectionStatuses
        );
      }
      if (
        context?.customImageStatusKey &&
        context?.previousCustomImageStatuses
      ) {
        queryClient.setQueryData(
          context.customImageStatusKey,
          context.previousCustomImageStatuses
        );
      }
    },

    onSuccess: async (_data, _variables, context) => {
      const imageId = context?.imageId;
      if (imageId === null) return;

      if (!silentPoll.entries.has(imageId)) {
        silentPoll.entries.set(imageId, { attempts: 0 });
      }

      startOrExtendSilentPolling(queryClient);
    },
  });
};

export const useStopImageSync = (
  mutationOptions?: Options<StopSyncBootsourceBootsourceselectionData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      StopSyncBootsourceBootsourceselectionResponses,
      StopSyncBootsourceBootsourceselectionErrors,
      StopSyncBootsourceBootsourceselectionData
    >(mutationOptions, stopSyncBootsourceBootsourceselection),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: IMAGES_WORKFLOW_KEY,
      });
    },
  });
};
