import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mutationOptionsWithHeaders, queryOptionsWithHeaders } from "../utils";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateGroupData,
  CreateGroupErrors,
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
  UpdateGroupData,
  UpdateGroupErrors,
  UpdateGroupResponses,
  CreateGroupResponses,
  UserGroupStatisticsResponse,
  ListGroupEntitlementsData,
  ListGroupEntitlementsErrors,
  ListGroupEntitlementsResponses,
  ListGroupMembersData,
  ListGroupMembersErrors,
  ListGroupMembersResponses,
  RemoveGroupEntitlementData,
  RemoveGroupEntitlementResponses,
  RemoveGroupEntitlementErrors,
  RemoveGroupMemberData,
  RemoveGroupMemberErrors,
  RemoveGroupMemberResponses,
} from "@/app/apiclient";
import {
  removeGroupMember,
  removeGroupEntitlement,
  listGroupMembers,
  listGroupEntitlements,
  deleteGroup,
  listGroups,
  getGroup,
  listGroupsStatistics,
  createGroup,
  updateGroup,
} from "@/app/apiclient";
import {
  getGroupQueryKey,
  listGroupEntitlementsQueryKey,
  listGroupMembersQueryKey,
  listGroupsQueryKey,
  listGroupsStatisticsQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import type { Options } from "@/app/apiclient/client";

type UseGroupsResult = {
  data:
    | {
        items: {
          statistics: UserGroupStatisticsResponse | undefined;
          id: number;
          name: string;
          description?: string;
        }[];
        total: number;
      }
    | undefined;
  isPending: UseQueryResult["isPending"];
  isSuccess: UseQueryResult["isSuccess"];
  isError: UseQueryResult["isError"];
};

export const useGroups = (
  options?: Options<ListGroupsData>
): UseGroupsResult => {
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
  options: Options<ListGroupsStatisticsData>,
  enabled = true
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListGroupsStatisticsResponses,
      ListGroupsStatisticsErrors,
      ListGroupsStatisticsData
    >(options, listGroupsStatistics, listGroupsStatisticsQueryKey(options)),
    enabled,
  });
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

export const useCreateGroup = (mutationOptions?: Options<CreateGroupData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateGroupResponses,
      CreateGroupErrors,
      CreateGroupData
    >(mutationOptions, createGroup),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listGroupsQueryKey(),
      });
    },
  });
};

export const useUpdateGroup = (mutationOptions?: Options<UpdateGroupData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateGroupResponses,
      UpdateGroupErrors,
      UpdateGroupData
    >(mutationOptions, updateGroup),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listGroupsQueryKey(),
      });
    },
  });
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

// TODO: add entitlement query hook tests
export const useGroupEntitlements = (
  options: Options<ListGroupEntitlementsData>
) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListGroupEntitlementsResponses,
      ListGroupEntitlementsErrors,
      ListGroupEntitlementsData
    >(options, listGroupEntitlements, listGroupEntitlementsQueryKey(options))
  );
};

export const useRemoveGroupEntitlement = (
  mutationOptions?: Options<RemoveGroupEntitlementData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      RemoveGroupEntitlementResponses,
      RemoveGroupEntitlementErrors,
      RemoveGroupEntitlementData
    >(mutationOptions, removeGroupEntitlement),
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: listGroupEntitlementsQueryKey({
          path: { group_id: variables.path.group_id },
        }),
      });
    },
  });
};

// TODO: add member query hook tests
export const useGroupMembers = (options: Options<ListGroupMembersData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListGroupMembersResponses,
      ListGroupMembersErrors,
      ListGroupMembersData
    >(options, listGroupMembers, listGroupMembersQueryKey(options))
  );
};

export const useRemoveGroupMember = (
  mutationOptions?: Options<RemoveGroupMemberData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      RemoveGroupMemberResponses,
      RemoveGroupMemberErrors,
      RemoveGroupMemberData
    >(mutationOptions, removeGroupMember),
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: listGroupMembersQueryKey({
          path: { group_id: variables.path.group_id },
        }),
      });
    },
  });
};
