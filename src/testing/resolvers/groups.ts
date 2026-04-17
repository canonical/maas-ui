import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  CreateGroupError,
  GetGroupError,
  ListGroupsError,
  ListGroupsResponse,
  ListGroupsStatisticsError,
  ListGroupsStatisticsResponse,
  UpdateGroupError,
} from "@/app/apiclient";
import {
  group as groupFactory,
  groupStatistics as groupStatsFactory,
} from "@/testing/factories/groups";

const mockGroups: ListGroupsResponse = {
  items: [
    groupFactory({
      id: 1,
      name: "group1",
      description: "First group",
    }),
    groupFactory({
      id: 2,
      name: "group2",
      description: "Second group",
    }),
    groupFactory({
      id: 3,
      name: "group3",
      description: "Third group",
    }),
  ],
  total: 3,
};

const mockGroupStatistics: ListGroupsStatisticsResponse = {
  items: [
    groupStatsFactory({
      id: 1,
      user_count: 5,
    }),
    groupStatsFactory({
      id: 2,
      user_count: 10,
    }),
    groupStatsFactory({
      id: 3,
      user_count: 15,
    }),
  ],
  total: 3,
};

const mockListGroupsError = {
  message: "Unprocessable Entity",
  code: 422,
  kind: "Error",
};

const mockListGroupsStatisticsError = {
  message: "Unprocessable Entity",
  code: 422,
  kind: "Error",
};

const mockGetGroupError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const mockCreateGroupError = {
  message: "A group with this name already exists.",
  code: 409,
  kind: "Error",
};

const mockUpdateGroupError = {
  message: "Unprocessable Entity",
  code: 422,
  kind: "Error",
};

const mockDeleteGroupError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const groupsResolvers = {
  listGroups: {
    resolved: false,
    handler: (data: ListGroupsResponse = mockGroups) =>
      http.get(`${BASE_URL}MAAS/a/v3/groups`, () => {
        groupsResolvers.listGroups.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListGroupsError = mockListGroupsError) =>
      http.get(`${BASE_URL}MAAS/a/v3/groups`, () => {
        groupsResolvers.listGroups.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listGroupsStatistics: {
    resolved: false,
    handler: (data: ListGroupsStatisticsResponse = mockGroupStatistics) =>
      http.get(`${BASE_URL}MAAS/a/v3/groups:statistics`, () => {
        groupsResolvers.listGroupsStatistics.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListGroupsStatisticsError = mockListGroupsStatisticsError) =>
      http.get(`${BASE_URL}MAAS/a/v3/groups:statistics`, () => {
        groupsResolvers.listGroupsStatistics.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getGroup: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/groups/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        const group = mockGroups.items.find((group) => group.id === id);
        groupsResolvers.getGroup.resolved = true;
        return group ? HttpResponse.json(group) : HttpResponse.error();
      }),
    error: (error: GetGroupError = mockGetGroupError) =>
      http.get(`${BASE_URL}MAAS/a/v3/groups/:id`, () => {
        groupsResolvers.getGroup.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createGroup: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/groups`, () => {
        groupsResolvers.createGroup.resolved = true;
        return HttpResponse.json({ id: 1 });
      }),
    error: (error: CreateGroupError = mockCreateGroupError) =>
      http.post(`${BASE_URL}MAAS/a/v3/groups`, () => {
        groupsResolvers.createGroup.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updateGroup: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/groups/:id`, () => {
        groupsResolvers.updateGroup.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateGroupError = mockUpdateGroupError) =>
      http.put(`${BASE_URL}MAAS/a/v3/groups/:id`, () => {
        groupsResolvers.updateGroup.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteGroup: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/groups/:id`, () => {
        groupsResolvers.deleteGroup.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: typeof mockDeleteGroupError = mockDeleteGroupError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/groups/:id`, () => {
        groupsResolvers.deleteGroup.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { groupsResolvers, mockGroups, mockGroupStatistics };
