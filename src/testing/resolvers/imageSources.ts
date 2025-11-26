import { http, HttpResponse } from "msw";

import { imageSourceFactory } from "../factories";
import { BASE_URL } from "../utils";

import type {
  BootSourcesListResponse,
  GetBootsourceError,
  ListBootsourcesError,
  UpdateBootsourceError,
} from "@/app/apiclient";

const mockImageSources: BootSourcesListResponse = {
  items: [
    imageSourceFactory.build({
      id: 1,
      url: "http://images.maas.io/ephemeral-v3/stable/",
      keyring_filename: "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
      keyring_data: "aabbccdd",
      priority: 0,
      skip_keyring_verification: false,
    }),
  ],
  total: 1,
};

const mockListImageSourcesError: ListBootsourcesError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error",
};

const mockGetImageSourceError: GetBootsourceError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const mockUpdateImageSourceError: UpdateBootsourceError = {
  message: "Bad request",
  code: 400,
  kind: "Error",
};

const imageSourceResolvers = {
  listImageSources: {
    resolved: false,
    handler: (data: BootSourcesListResponse = mockImageSources) =>
      http.get(`${BASE_URL}MAAS/a/v3/boot_sources`, () => {
        imageSourceResolvers.listImageSources.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListBootsourcesError = mockListImageSourcesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/boot_sources`, () => {
        imageSourceResolvers.listImageSources.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getImageSource: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/boot_sources/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        const imageSource = mockImageSources.items.find(
          (source) => source.id === id
        );
        imageSourceResolvers.getImageSource.resolved = true;
        return imageSource
          ? HttpResponse.json(imageSource)
          : HttpResponse.error();
      }),
    error: (error: GetBootsourceError = mockGetImageSourceError) =>
      http.get(`${BASE_URL}MAAS/a/v3/boot_sources/:id`, () => {
        imageSourceResolvers.getImageSource.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updateImageSource: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/boot_sources/:id`, () => {
        imageSourceResolvers.updateImageSource.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateBootsourceError = mockUpdateImageSourceError) =>
      http.put(`${BASE_URL}MAAS/a/v3/boot_sources/:id`, () => {
        imageSourceResolvers.updateImageSource.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { imageSourceResolvers, mockImageSources };
