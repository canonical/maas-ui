import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mutationOptionsWithHeaders, queryOptionsWithHeaders } from "../utils";

import { useWebsocketAwareQuery } from "./base";

import type {
  DeleteGroupData,
  DeleteGroupErrors,
  DeleteGroupResponses,
  GetGroupData,
  GetGroupErrors,
  GetGroupResponses,
  ListGroupsData,
  ListGroupsErrors,
  ListGroupsResponses,
  ListGroupsStatisticsData,
  ListGroupsStatisticsErrors,
  ListGroupsStatisticsResponses,
} from "@/app/apiclient";
import {
  deleteGroup,
  listGroups,
  getGroup,
  listGroupsStatistics,
} from "@/app/apiclient";
import {
  getGroupQueryKey,
  listGroupsQueryKey,
  listGroupsStatisticsQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import type { Options } from "@/app/apiclient/client";

export const useGroups = (options?: Options<ListGroupsData>) => {
  const groups = useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListGroupsResponses,
      ListGroupsErrors,
      ListGroupsData
    >(options, listGroups, listGroupsQueryKey(options))
  );

  const groupIds = groups.data?.items.map((group) => group.id) ?? [];

  const statistics = useGroupStatistics({
    query: { id: groupIds },
  });

  return {
    ...groups,
    data: groups.data
      ? {
          ...groups.data,
          items: groups.data.items.map((group) => ({
            ...group,
            statistics: statistics.data?.items.find(
              (stat) => stat.id === group.id
            ),
          })),
        }
      : undefined,
  };
};

export const useGroupStatistics = (
  options: Options<ListGroupsStatisticsData>
) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListGroupsStatisticsResponses,
      ListGroupsStatisticsErrors,
      ListGroupsStatisticsData
    >(options, listGroupsStatistics, listGroupsStatisticsQueryKey(options))
  );
};

export const useGetGroup = (options: Options<GetGroupData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<GetGroupResponses, GetGroupErrors, GetGroupData>(
      options,
      getGroup,
      getGroupQueryKey(options)
    )
  );
};

export const useDeleteGroup = (mutationOptions?: Options<DeleteGroupData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteGroupResponses,
      DeleteGroupErrors,
      DeleteGroupData
    >(mutationOptions, deleteGroup),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listGroupsQueryKey(),
      });
    },
  });
};
