import { http, HttpResponse } from "msw";

import type {
  ImageListResponse,
  ImageStatisticListResponse,
  ImageStatusListResponse,
  ListSelectionsError,
  ListSelectionStatisticError,
  ListSelectionStatusError,
} from "@/app/apiclient";
import {
  imageFactory,
  imageStatisticsFactory,
  imageStatusFactory,
} from "@/testing/factories/image";
import { BASE_URL } from "@/testing/utils";

const mockSelections: ImageListResponse = {
  items: [
    imageFactory.build({
      os: "ubuntu",
      release: "noble",
      title: "24.04 LTS",
    }),
    imageFactory.build({
      os: "ubuntu",
      release: "jammy",
      title: "22.04 LTS",
    }),
    imageFactory.build({
      os: "centos",
      release: "centos7",
      title: "7.0",
    }),
  ],
  total: 3,
};

const mockStatistics: ImageStatisticListResponse = {
  items: imageStatisticsFactory.buildList(3),
  total: 3,
};

const mockStatuses: ImageStatusListResponse = {
  items: imageStatusFactory.buildList(3),
  total: 3,
};

const mockListImagesError: ListSelectionsError = {
  message: "Invalid",
  code: 422,
  kind: "Error",
};

const mockListImageStatisticsError: ListSelectionStatisticError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const mockListImageStatusesError: ListSelectionStatusError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const imageResolvers = {
  listSelections: {
    resolved: false,
    handler: (data: ImageListResponse = mockSelections) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections`, () => {
        imageResolvers.listSelections.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListSelectionsError = mockListImagesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections`, () => {
        imageResolvers.listSelections.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listSelectionStatistics: {
    resolved: false,
    handler: (data: ImageStatisticListResponse = mockStatistics) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections/statistics`, () => {
        imageResolvers.listSelectionStatistics.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (
      error: ListSelectionStatisticError = mockListImageStatisticsError
    ) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections/statistics`, () => {
        imageResolvers.listSelectionStatistics.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listSelectionStatuses: {
    resolved: false,
    handler: (data: ImageStatusListResponse = mockStatuses) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections/statuses`, () => {
        imageResolvers.listSelectionStatuses.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListSelectionStatusError = mockListImageStatusesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/selections/statuses`, () => {
        imageResolvers.listSelectionStatuses.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listCustomImages: {
    resolved: false,
    handler: (data: ImageListResponse = { items: [], total: 0 }) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images`, () => {
        imageResolvers.listCustomImages.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListSelectionsError = mockListImagesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images`, () => {
        imageResolvers.listCustomImages.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listCustomImageStatistics: {
    resolved: false,
    handler: (data: ImageStatisticListResponse = { items: [], total: 0 }) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images/statistics`, () => {
        imageResolvers.listCustomImageStatistics.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (
      error: ListSelectionStatisticError = mockListImageStatisticsError
    ) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images/statistics`, () => {
        imageResolvers.listCustomImageStatistics.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  listCustomImageStatuses: {
    resolved: false,
    handler: (data: ImageStatusListResponse = { items: [], total: 0 }) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images/statuses`, () => {
        imageResolvers.listCustomImageStatuses.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListSelectionStatusError = mockListImageStatusesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/custom_images/statuses`, () => {
        imageResolvers.listCustomImageStatuses.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { imageResolvers, mockSelections, mockStatistics, mockStatuses };
