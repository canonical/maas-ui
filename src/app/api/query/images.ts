import { useMemo } from "react";

import type { Query, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type { WithHeaders } from "@/app/api/utils";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  BulkCreateSelectionsData,
  BulkCreateSelectionsErrors,
  BulkCreateSelectionsResponses,
  BulkDeleteSelectionsData,
  BulkDeleteSelectionsErrors,
  BulkDeleteSelectionsResponses,
  GetAllAvailableImagesData,
  GetAllAvailableImagesErrors,
  GetAllAvailableImagesResponses,
  ImageStatusListResponse,
  ImageStatusResponse,
  ListCustomImagesData,
  ListCustomImagesError,
  ListCustomImagesErrors,
  ListCustomImagesResponses,
  ListCustomImagesStatisticData,
  ListCustomImagesStatisticError,
  ListCustomImagesStatisticErrors,
  ListCustomImagesStatisticResponses,
  ListCustomImagesStatusData,
  ListCustomImagesStatusError,
  ListCustomImagesStatusErrors,
  ListCustomImagesStatusResponse,
  ListCustomImagesStatusResponses,
  ListSelectionsData,
  ListSelectionsErrors,
  ListSelectionsResponses,
  ListSelectionStatisticData,
  ListSelectionStatisticError,
  ListSelectionStatisticErrors,
  ListSelectionStatisticResponses,
  ListSelectionStatusData,
  ListSelectionStatusError,
  ListSelectionStatusErrors,
  ListSelectionStatusResponse,
  ListSelectionStatusResponses,
  Options,
  StopSyncBootsourceBootsourceselectionData,
  StopSyncBootsourceBootsourceselectionErrors,
  StopSyncBootsourceBootsourceselectionResponses,
  SyncBootsourceBootsourceselectionData,
  SyncBootsourceBootsourceselectionErrors,
  SyncBootsourceBootsourceselectionResponses,
} from "@/app/apiclient";
import {
  bulkCreateSelections,
  bulkDeleteSelections,
  getAllAvailableImages,
  stopSyncBootsourceBootsourceselection,
  syncBootsourceBootsourceselection,
  listCustomImagesStatistic,
  listCustomImagesStatus,
  listSelectionStatistic,
  listCustomImages,
  listSelectionStatus,
  listSelections,
} from "@/app/apiclient";
import {
  getAllAvailableImagesQueryKey,
  listCustomImagesQueryKey,
  listCustomImagesStatisticQueryKey,
  listCustomImagesStatusQueryKey,
  listSelectionsQueryKey,
  listSelectionStatisticQueryKey,
  listSelectionStatusQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import type { Image } from "@/app/images/types";

export const IMAGES_WORKFLOW_KEY = ["images-workflow"];

const ACTIVE_DOWNLOAD_REFETCH_INTERVAL = 5000;
const IDLE_REFETCH_INTERVAL = 60000;

type UseImagesResult = {
  data: { items: Image[]; total: number };
  isLoading: UseQueryResult["isLoading"];
  isSuccess: UseQueryResult["isSuccess"];
  isError: UseQueryResult["isError"];
  error: UseQueryResult<
    ListCustomImagesData | ListSelectionsData,
    ListCustomImagesError
  >["error"];
  stages: {
    images: {
      isLoading: UseQueryResult["isLoading"];
      isSuccess: UseQueryResult["isSuccess"];
      isError: UseQueryResult["isError"];
      error: UseQueryResult<
        ListCustomImagesData | ListSelectionsData,
        ListCustomImagesError
      >["error"];
    };
    statuses: {
      isLoading: UseQueryResult["isLoading"];
      isSuccess: UseQueryResult["isSuccess"];
      isError: UseQueryResult["isError"];
      error: UseQueryResult<
        ListCustomImagesStatusData | ListSelectionStatusData,
        ListCustomImagesStatusError | ListSelectionStatusError
      >["error"];
    };
    statistics: {
      isLoading: UseQueryResult["isLoading"];
      isSuccess: UseQueryResult["isSuccess"];
      isError: UseQueryResult["isError"];
      error: UseQueryResult<
        ListCustomImagesStatisticData | ListSelectionStatisticData,
        ListCustomImagesStatisticError | ListSelectionStatisticError
      >["error"];
    };
  };
};

const withImagesWorkflow = (key: readonly unknown[]) =>
  [...IMAGES_WORKFLOW_KEY, ...key] as const;

const calculateRefetchInterval = (statuses?: ImageStatusResponse[]): number => {
  const hasActiveDownloads = statuses?.some(
    (status) => status.status === "Downloading"
  );

  return hasActiveDownloads
    ? ACTIVE_DOWNLOAD_REFETCH_INTERVAL
    : IDLE_REFETCH_INTERVAL;
};

export const useImages = (
  options?: Options<ListSelectionsData>
): UseImagesResult => {
  const selections = useSelections(options);
  const customImages = useCustomImages(options);

  // Use function form of refetchInterval for dynamic calculation based on query data
  const selectionStatuses = useSelectionStatuses(
    {
      ...options,
      refetchInterval: (query) => {
        return calculateRefetchInterval(query.state.data?.items);
      },
    },
    selections.isSuccess
  );

  const customImageStatuses = useCustomImageStatuses(
    {
      ...options,
      refetchInterval: (query) => {
        return calculateRefetchInterval(query.state.data?.items);
      },
    },
    customImages.isSuccess
  );

  // Statistics queries do NOT use dynamic refetch - they use default behavior
  const selectionStatistics = useSelectionStatistics(
    options,
    selections.isSuccess
  );
  const customImageStatistics = useCustomImageStatistics(
    options,
    customImages.isSuccess
  );

  const images = useMemo(() => {
    const baseImages = [
      ...(selections.data?.items ?? []),
      ...(customImages.data?.items ?? []),
    ];
    const statuses = [
      ...(selectionStatuses.data?.items ?? []),
      ...(customImageStatuses.data?.items ?? []),
    ];
    const statistics = [
      ...(selectionStatistics.data?.items ?? []),
      ...(customImageStatistics.data?.items ?? []),
    ];

    return baseImages.map((image): Image => {
      const status = statuses.find((value) => value.id === image.id);
      const statistic = statistics.find((value) => value.id === image.id);
      return {
        id: image.id,
        os: image.os,
        release: image.release,
        title: image.title,
        architecture: image.architecture,
        boot_source_id: image.boot_source_id,
        status: status?.status,
        update_status: status?.update_status,
        sync_percentage: status?.sync_percentage,
        selected: status?.selected,
        last_updated: statistic?.last_updated,
        last_deployed: statistic?.last_deployed,
        size: statistic?.size,
        node_count: statistic?.node_count,
        deploy_to_memory: statistic?.deploy_to_memory,
      };
    });
  }, [
    selections.data,
    customImages.data,
    selectionStatuses.data,
    customImageStatuses.data,
    selectionStatistics.data,
    customImageStatistics.data,
  ]);

  const stages = useMemo(
    (): UseImagesResult["stages"] => ({
      images: {
        isLoading: selections.isLoading || customImages.isLoading,
        isSuccess: selections.isSuccess && customImages.isSuccess,
        isError: selections.isError || customImages.isError,
        error: selections.error || customImages.error || null,
      },
      statuses: {
        isLoading: selectionStatuses.isLoading || customImageStatuses.isLoading,
        isSuccess: selectionStatuses.isSuccess && customImageStatuses.isSuccess,
        isError: selectionStatuses.isError || customImageStatuses.isError,
        error: selectionStatuses.error || customImageStatuses.error || null,
      },
      statistics: {
        isLoading:
          selectionStatistics.isLoading || customImageStatistics.isLoading,
        isSuccess:
          selectionStatistics.isSuccess && customImageStatistics.isSuccess,
        isError: selectionStatistics.isError || customImageStatistics.isError,
        error: selectionStatistics.error || customImageStatistics.error || null,
      },
    }),
    [
      selections,
      customImages,
      selectionStatuses,
      customImageStatuses,
      selectionStatistics,
      customImageStatistics,
    ]
  );

  return useMemo(
    (): UseImagesResult => ({
      data: { items: images, total: selections.data?.total ?? images.length },
      isLoading:
        selections.isLoading ||
        customImages.isLoading ||
        selectionStatuses.isLoading ||
        customImageStatuses.isLoading ||
        selectionStatistics.isLoading ||
        customImageStatistics.isLoading,
      isSuccess:
        selections.isSuccess &&
        customImages.isSuccess &&
        selectionStatuses.isSuccess &&
        customImageStatuses.isSuccess &&
        selectionStatistics.isSuccess &&
        customImageStatistics.isSuccess,
      isError:
        selections.isError ||
        customImages.isError ||
        selectionStatuses.isError ||
        customImageStatuses.isError ||
        selectionStatistics.isError ||
        customImageStatistics.isError,
      error:
        selections.error ||
        customImages.error ||
        selectionStatuses.error ||
        customImageStatuses.error ||
        selectionStatistics.error ||
        customImageStatistics.error ||
        null,
      stages,
    }),
    [
      images,
      stages,
      selections,
      customImages,
      selectionStatuses,
      customImageStatuses,
      selectionStatistics,
      customImageStatistics,
    ]
  );
};

export const useSelections = (options?: Options<ListSelectionsData>) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListSelectionsResponses,
      ListSelectionsErrors,
      ListSelectionsData
    >(
      options,
      listSelections,
      withImagesWorkflow(listSelectionsQueryKey(options))
    ),
  });
};

export const useSelectionStatuses = (
  options?: Options<ListSelectionStatusData> & {
    refetchInterval?: (
      query: Query<
        WithHeaders<ImageStatusListResponse>,
        ListSelectionStatusError
      >
    ) => number;
  },
  enabled?: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListSelectionStatusResponses,
      ListSelectionStatusErrors,
      ListSelectionStatusData
    >(
      options,
      listSelectionStatus,
      withImagesWorkflow(listSelectionStatusQueryKey(options))
    ),
    refetchInterval: options?.refetchInterval,
    enabled,
  });
};

export const useSelectionStatistics = (
  options?: Options<ListSelectionStatisticData>,
  enabled?: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListSelectionStatisticResponses,
      ListSelectionStatisticErrors,
      ListSelectionStatisticData
    >(
      options,
      listSelectionStatistic,
      withImagesWorkflow(listSelectionStatisticQueryKey(options))
    ),
    enabled,
  });
};

export const useCustomImages = (options?: Options<ListCustomImagesData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListCustomImagesResponses,
      ListCustomImagesErrors,
      ListCustomImagesData
    >(
      options,
      listCustomImages,
      withImagesWorkflow(listCustomImagesQueryKey(options))
    )
  );
};

export const useCustomImageStatuses = (
  options?: Options<ListCustomImagesStatusData> & {
    refetchInterval?: (
      query: Query<
        WithHeaders<ImageStatusListResponse>,
        ListSelectionStatusError
      >
    ) => number;
  },
  enabled?: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListCustomImagesStatusResponses,
      ListCustomImagesStatusErrors,
      ListCustomImagesStatusData
    >(
      options,
      listCustomImagesStatus,
      withImagesWorkflow(listCustomImagesStatusQueryKey(options))
    ),
    refetchInterval: options?.refetchInterval,
    enabled,
  });
};

export const useCustomImageStatistics = (
  options?: Options<ListCustomImagesStatisticData>,
  enabled?: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListCustomImagesStatisticResponses,
      ListCustomImagesStatisticErrors,
      ListCustomImagesStatisticData
    >(
      options,
      listCustomImagesStatistic,
      withImagesWorkflow(listCustomImagesStatisticQueryKey(options))
    ),
    enabled,
  });
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

      console.log("Starting optimistic update for image:", imageId);

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

      console.log("Found queries:", {
        selectionStatus: selectionStatusQueries.length,
        customImageStatus: customImageStatusQueries.length,
      });

      // Extract the actual query keys and data
      const [selectionStatusKey, previousSelectionStatuses] =
        selectionStatusQueries[0] || [null, null];
      const [customImageStatusKey, previousCustomImageStatuses] =
        customImageStatusQueries[0] || [null, null];

      console.log("Retrieved data:", {
        hasSelectionData: !!previousSelectionStatuses,
        hasCustomImageData: !!previousCustomImageStatuses,
      });

      // Optimistically update selection statuses to "Downloading"
      if (selectionStatusKey && previousSelectionStatuses) {
        const updatedSelectionStatuses = {
          ...previousSelectionStatuses,
          items: previousSelectionStatuses.items.map((item) =>
            item.id === imageId
              ? { ...item, status: "Downloading" as const }
              : item
          ),
        };

        queryClient.setQueryData<ListSelectionStatusResponse>(
          selectionStatusKey,
          updatedSelectionStatuses
        );
        console.log("✅ Updated selection statuses to Downloading");
      } else {
        console.error("❌ Could not update selection statuses");
      }

      // Optimistically update custom image statuses to "Downloading"
      if (customImageStatusKey && previousCustomImageStatuses) {
        const updatedCustomImageStatuses = {
          ...previousCustomImageStatuses,
          items: previousCustomImageStatuses.items.map((item) =>
            item.id === imageId
              ? { ...item, status: "Downloading" as const }
              : item
          ),
        };

        queryClient.setQueryData<ListCustomImagesStatusResponse>(
          customImageStatusKey,
          updatedCustomImageStatuses
        );
        console.log("✅ Updated custom image statuses to Downloading");
      } else {
        console.error("❌ Could not update custom image statuses");
      }

      // Return context with previous values for potential rollback
      return {
        selectionStatusKey,
        customImageStatusKey,
        previousSelectionStatuses,
        previousCustomImageStatuses,
        imageId,
      };
    },

    onError: (_err, _variables, context) => {
      console.log("Mutation failed, rolling back optimistic updates");

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
      console.log("Mutation succeeded for image:", imageId);

      // Don't invalidate immediately - let the optimistic update stay visible
      // The dynamic refetch interval (5s for "Downloading") will update it soon

      // Instead, start polling to check if backend has caught up
      let pollAttempts = 0;
      const maxPollAttempts = 10; // Poll for up to 50 seconds (10 * 5s)

      const pollBackendStatus = async () => {
        pollAttempts++;

        // Refetch just the status queries silently (don't invalidate everything)
        await Promise.all([
          context?.selectionStatusKey
            ? queryClient.fetchQuery({
                queryKey: context.selectionStatusKey,
              })
            : Promise.resolve(null),
          context?.customImageStatusKey
            ? queryClient.fetchQuery({
                queryKey: context.customImageStatusKey,
              })
            : Promise.resolve(null),
        ]);

        // Check if backend has updated to "Downloading"
        const selectionData = context?.selectionStatusKey
          ? queryClient.getQueryData<ListSelectionStatusResponse>(
              context.selectionStatusKey
            )
          : null;
        const customImageData = context?.customImageStatusKey
          ? queryClient.getQueryData<ListCustomImagesStatusResponse>(
              context.customImageStatusKey
            )
          : null;

        const backendStatus =
          selectionData?.items.find((item) => item.id === imageId)?.status ||
          customImageData?.items.find((item) => item.id === imageId)?.status;

        console.log(
          `Poll attempt ${pollAttempts}: Backend status =`,
          backendStatus
        );

        // If backend caught up to "Downloading" or we've polled enough, stop
        if (
          backendStatus === "Downloading" ||
          pollAttempts >= maxPollAttempts
        ) {
          console.log(
            "✅ Backend caught up or max attempts reached, invalidating all queries"
          );

          // Now invalidate everything to refresh all related data
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listSelectionsQueryKey()),
            }),
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listSelectionStatusQueryKey()),
            }),
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listSelectionStatisticQueryKey()),
            }),
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listCustomImagesQueryKey()),
            }),
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listCustomImagesStatusQueryKey()),
            }),
            queryClient.invalidateQueries({
              queryKey: withImagesWorkflow(listCustomImagesStatisticQueryKey()),
            }),
          ]);
        } else {
          // Backend hasn't caught up yet, poll again in 5 seconds
          console.log("⏳ Backend not ready, polling again in 5s...");
          setTimeout(pollBackendStatus, 5000);
        }
      };

      // Start polling after a brief delay to give backend a head start
      setTimeout(pollBackendStatus, 2000);
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

export const useAvailableSelections = (
  options?: Options<GetAllAvailableImagesData>
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetAllAvailableImagesResponses,
      GetAllAvailableImagesErrors,
      GetAllAvailableImagesData
    >(options, getAllAvailableImages, getAllAvailableImagesQueryKey(options)),
  });
};

export const useAddSelections = (
  mutationOptions?: Options<BulkCreateSelectionsData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      BulkCreateSelectionsResponses,
      BulkCreateSelectionsErrors,
      BulkCreateSelectionsData
    >(mutationOptions, bulkCreateSelections),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: IMAGES_WORKFLOW_KEY,
      });
    },
  });
};

export const useDeleteSelections = (
  mutationOptions?: Options<BulkDeleteSelectionsData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      BulkDeleteSelectionsResponses,
      BulkDeleteSelectionsErrors,
      BulkDeleteSelectionsData
    >(mutationOptions, bulkDeleteSelections),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: IMAGES_WORKFLOW_KEY,
      });
    },
  });
};
