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
    (status) =>
      status.status === "Downloading" ||
      status.status === "Waiting for download"
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
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: IMAGES_WORKFLOW_KEY,
      });
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
