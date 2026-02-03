import { useEffect } from "react";

import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { IMAGES_WORKFLOW_KEY } from "@/app/api/query/images";
import type {
  ImageStatus,
  ImageStatusResponse,
  ImageUpdateStatus,
  ListSelectionStatusResponse,
} from "@/app/apiclient";
import {
  registerPollingHook,
  silentPoll,
  startOrExtendSilentPolling,
} from "@/app/images/hooks/useOptimisticImages/utils/silentPolling";

type OptimisticMutateProps = {
  queryClient: QueryClient;
  imageId: number;
  action: "start" | "stop";
};

export type OptimisticMutateResult = {
  selectionStatusKey: readonly unknown[];
  previousSelectionStatuses?: ListSelectionStatusResponse;
  imageId: number;
};

type OptimisticOnErrorProps = {
  queryClient: QueryClient;
  onMutateResult: OptimisticMutateResult | undefined;
};

type OptimisticOnSuccessProps = {
  queryClient: QueryClient;
  onMutateResult: OptimisticMutateResult | undefined;
  action: "start" | "stop";
};

const optimisticMutate = async ({
  queryClient,
  imageId,
  action,
}: OptimisticMutateProps): Promise<OptimisticMutateResult> => {
  // Cancel all queries to prevent overwrites
  await queryClient.cancelQueries();

  // Get data using predicate instead of exact key match
  const selectionStatusQueries =
    queryClient.getQueriesData<ListSelectionStatusResponse>({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key[0] === IMAGES_WORKFLOW_KEY[0] &&
          typeof key[1] === "object" &&
          key[1]?._id === "listSelectionStatus"
        );
      },
    });

  const haltingSyncStatus: ImageStatus =
    action === "start" ? "Waiting for download" : "Downloading";
  const haltingUpdateStatus: ImageUpdateStatus =
    action === "start" ? "Update available" : "Downloading";

  const optimisticSyncOverride: Partial<
    Pick<ImageStatusResponse, "status" | "sync_percentage">
  > =
    action === "start"
      ? {
          status: "Optimistic" as ImageStatus,
          sync_percentage: 0,
        }
      : { status: "Stopping" as ImageStatus };

  const optimisticUpdateOverride: Partial<
    Pick<ImageStatusResponse, "sync_percentage" | "update_status">
  > =
    action === "start"
      ? {
          update_status: "Optimistic" as ImageUpdateStatus,
          sync_percentage: 0,
        }
      : { update_status: "Stopping" as ImageUpdateStatus };

  // Extract the actual query keys and data
  const [selectionStatusKey, previousSelectionStatuses] =
    selectionStatusQueries[0] || [null, null];

  // Optimistically update selection statuses to "Optimistic" or "Stopping"
  if (selectionStatusKey && previousSelectionStatuses) {
    const updatedSelectionStatuses = {
      ...previousSelectionStatuses,
      items: previousSelectionStatuses.items.map((item) => {
        if (item.id === imageId && item.status === haltingSyncStatus) {
          return {
            ...item,
            ...optimisticSyncOverride,
          };
        } else if (
          item.id === imageId &&
          item.update_status === haltingUpdateStatus
        ) {
          return {
            ...item,
            ...optimisticUpdateOverride,
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

  return {
    selectionStatusKey,
    previousSelectionStatuses,
    imageId,
  };
};

const optimisticOnError = ({
  queryClient,
  onMutateResult,
}: OptimisticOnErrorProps): void => {
  if (!onMutateResult) return;
  // Rollback to previous state if mutation fails
  if (
    onMutateResult?.selectionStatusKey &&
    onMutateResult?.previousSelectionStatuses
  ) {
    queryClient.setQueryData(
      onMutateResult.selectionStatusKey,
      onMutateResult.previousSelectionStatuses
    );
  }
};

const optimisticOnSuccess = ({
  queryClient,
  onMutateResult,
  action,
}: OptimisticOnSuccessProps): void => {
  if (!onMutateResult) return;

  const imageId = onMutateResult?.imageId;

  if (
    !silentPoll.entries.has(imageId) ||
    silentPoll.entries.get(imageId)?.action !== action
  ) {
    silentPoll.entries.set(imageId, { attempts: 0, action: action });
  }

  startOrExtendSilentPolling(queryClient);
};

export const useOptimisticImages = (action: "start" | "stop") => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return registerPollingHook();
  }, []);

  const onMutateWithOptimisticImages = (
    imageId: number
  ): Promise<OptimisticMutateResult> => {
    return optimisticMutate({ queryClient, imageId, action });
  };

  const onErrorWithOptimisticImages = (
    onMutateResult: OptimisticMutateResult | undefined
  ): void => {
    optimisticOnError({ queryClient, onMutateResult });
  };

  const onSuccessWithOptimisticImages = (
    onMutateResult: OptimisticMutateResult
  ): void => {
    optimisticOnSuccess({ queryClient, onMutateResult, action });
  };

  return {
    onMutateWithOptimisticImages,
    onErrorWithOptimisticImages,
    onSuccessWithOptimisticImages,
  };
};
